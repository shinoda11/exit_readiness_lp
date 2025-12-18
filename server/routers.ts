import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import {
  insertTestSession,
  insertFitGateResponse,
  getFitGateResponseById,
  insertPrepModeSubscriber,
  getInvitationTokenByToken,
  markInvitationTokenAsUsed,
  hasActivePassSubscription,
  getPassSubscriptionByEmail,
  getPassOnboardingByEmail,
  upsertPassOnboarding,
  hasCompletedPassOnboarding,
  insertUpgradeRequest,
  insertSessionCheckout,
} from "./db";
import { stripe } from "./stripe";
import { PRODUCTS } from "./products";
import { z } from "zod";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  testSession: router({
    submit: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
          currentHousing: z.enum(["賃貸", "持ち家"]),
          incomeRange: z.enum(["1000-1500", "1500-2000", "2000-3000", "3000以上"]),
          propertyRange: z.enum(["賃貸継続", "6000", "8000", "1億以上"]),
          goalMode: z.enum(["守り", "ゆるExit", "フルFIRE視野"]),
          preferredTime: z.string().optional(),
          notes: z.string().optional(),
          utmSource: z.string().optional(),
          utmMedium: z.string().optional(),
          utmCampaign: z.string().optional(),
          utmContent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        await insertTestSession(input);
        return { success: true };
      }),
  }),

  fitGate: router({
    submit: publicProcedure
      .input(
        z.object({
          email: z.string().email().optional(),
          q1DecisionDeadline: z.string(),
          q2HousingStatus: z.string(),
          q3PriceRange: z.string(),
          q4IncomeRange: z.string(),
          q5AssetRange: z.string(),
          q6NumberInputTolerance: z.string(),
          q7CareerChange: z.string(),
          q8LifeEvent: z.string(),
          q9CurrentQuestion: z.string(),
          q10PreferredApproach: z.string(),
          q11PrivacyConsent: z.boolean(),
          q12BudgetSense: z.string(),
          invitationToken: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Judgment logic
        let judgmentResult: "prep" | "ready" | "session" = "prep";

        // Check invitation token
        let hasValidToken = false;
        if (input.invitationToken) {
          const token = await getInvitationTokenByToken(input.invitationToken);
          if (token && !token.isUsed) {
            hasValidToken = true;
            // Mark token as used
            if (input.email) {
              await markInvitationTokenAsUsed(input.invitationToken, input.email);
            }
          }
        }

        // Judgment criteria
        const incomeOk = ["1,500万〜2,499万", "2,500万以上"].includes(input.q4IncomeRange);
        const assetOk = ["2,000万〜4,999万", "5,000万以上"].includes(input.q5AssetRange);
        const numberInputOk = input.q6NumberInputTolerance === "年収/資産/支出/物件価格を入力できる";
        const budgetOk = ["3万〜4.9万なら検討", "5万円以上でも意思決定が進むなら払う"].includes(input.q12BudgetSense);

        if (hasValidToken && incomeOk && assetOk && numberInputOk) {
          judgmentResult = "session";
        } else if (incomeOk && assetOk && numberInputOk && budgetOk) {
          judgmentResult = "ready";
        } else {
          judgmentResult = "prep";
        }

        // Generate session ID (UUID)
        const sessionId = `fg_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

        // Insert response
        const result = await insertFitGateResponse({
          sessionId,
          ...input,
          judgmentResult,
        });

        return {
          success: true,
          judgmentResult,
          id: result[0].insertId,
        };
      }),

    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const response = await getFitGateResponseById(input.id);
        return response;
      }),
  }),

  prepMode: router({
    subscribe: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
        })
      )
      .mutation(async ({ input }) => {
        await insertPrepModeSubscriber(input);
        return { success: true };
      }),
  }),

  invitationToken: router({
    validate: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const token = await getInvitationTokenByToken(input.token);
        if (!token) {
          return { valid: false, message: "トークンが見つかりません" };
        }
        if (token.isUsed) {
          return { valid: false, message: "このトークンは既に使用されています" };
        }
        return { valid: true };
      }),
  }),

  pass: router({
    /**
     * Create Stripe Checkout Session for Pass purchase
     */
    createCheckoutSession: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Check if user already has active Pass subscription
        const hasActivePass = await hasActivePassSubscription(input.email);
        if (hasActivePass) {
          throw new Error("既にアクティブなPass購入があります");
        }

        const product = PRODUCTS.PASS_90_DAYS;
        const origin = ctx.req.headers.origin || 'http://localhost:3000';

        try {
          const session = await stripe.checkout.sessions.create({
            mode: 'payment',
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: product.currency,
                  product_data: {
                    name: product.name,
                    description: product.description,
                  },
                  unit_amount: product.price,
                },
                quantity: 1,
              },
            ],
            customer_email: input.email,
            client_reference_id: input.email,
            metadata: {
              product_type: 'pass',
              customer_email: input.email,
              customer_name: input.name || '',
              duration_days: product.durationDays.toString(),
            },
            success_url: `${origin}/pass/onboarding?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/fit-result?result=ready`,
            allow_promotion_codes: true,
          });

          return { url: session.url };
        } catch (error) {
          console.error('[Pass] Failed to create checkout session:', error);
          throw new Error('決済URLの発行に失敗しました');
        }
      }),

    /**
     * Check if user has active Pass subscription
     */
    checkSubscription: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const hasActive = await hasActivePassSubscription(input.email);
        return { hasActivePass: hasActive };
      }),

    /**
     * Get Stripe Session details to extract email
     */
    getStripeSession: publicProcedure
      .input(z.object({ sessionId: z.string() }))
      .query(async ({ input }) => {
        try {
          const session = await stripe.checkout.sessions.retrieve(input.sessionId);
          return {
            email: session.customer_email || session.customer_details?.email || null,
          };
        } catch (error) {
          console.error('[Pass] Failed to retrieve Stripe session:', error);
          throw new Error('Stripe Sessionの取得に失敗しました');
        }
      }),

    /**
     * Get Pass subscription details (including login credentials)
     */
    getSubscription: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const subscription = await getPassSubscriptionByEmail(input.email);
        if (!subscription) {
          throw new Error('Pass subscription not found');
        }
        return {
          email: subscription.email,
          loginId: subscription.loginId,
          loginPassword: subscription.loginPassword,
          expiryDate: subscription.expiryDate,
          status: subscription.status,
        };
      }),

    /**
     * Get Pass Onboarding progress
     */
    getOnboarding: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .query(async ({ input }) => {
        const onboarding = await getPassOnboardingByEmail(input.email);
        if (!onboarding) {
          // Create initial onboarding record if not exists
          await upsertPassOnboarding({
            email: input.email,
            task1AppOpened: false,
            task2CompareViewed: false,
            task3MemoGenerated: false,
          });
          return {
            task1AppOpened: false,
            task2CompareViewed: false,
            task3MemoGenerated: false,
            completedAt: null,
          };
        }
        return {
          task1AppOpened: onboarding.task1AppOpened,
          task2CompareViewed: onboarding.task2CompareViewed,
          task3MemoGenerated: onboarding.task3MemoGenerated,
          completedAt: onboarding.completedAt,
        };
      }),

    /**
     * Update Pass Onboarding task completion
     */
    updateOnboarding: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          taskNumber: z.union([z.literal(1), z.literal(2), z.literal(3)]),
        })
      )
      .mutation(async ({ input }) => {
        const onboarding = await getPassOnboardingByEmail(input.email);
        if (!onboarding) {
          throw new Error('Onboarding record not found');
        }

        // Preserve existing values and update the specific task
        const task1 = input.taskNumber === 1 ? true : onboarding.task1AppOpened;
        const task2 = input.taskNumber === 2 ? true : onboarding.task2CompareViewed;
        const task3 = input.taskNumber === 3 ? true : onboarding.task3MemoGenerated;
        
        const completedAt = (task1 && task2 && task3 && !onboarding.completedAt) ? new Date() : onboarding.completedAt;

        await upsertPassOnboarding({
          email: input.email,
          task1AppOpened: task1,
          task2CompareViewed: task2,
          task3MemoGenerated: task3,
          completedAt,
        });

        return { success: true };
      }),

    /**
     * Submit Upgrade request (Pass → Session)
     */
    submitUpgradeRequest: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
          reason: z.string().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Check if user has active Pass subscription
        const hasActive = await hasActivePassSubscription(input.email);
        if (!hasActive) {
          throw new Error('Pass subscription not found or expired');
        }

        // Check if user has completed Onboarding 3 tasks
        const hasCompleted = await hasCompletedPassOnboarding(input.email);
        if (!hasCompleted) {
          throw new Error('Onboarding 3タスクを完了してからUpgrade申請を行ってください');
        }

        // Insert Upgrade request
        await insertUpgradeRequest({
          email: input.email,
          notes: input.notes || `Name: ${input.name || 'N/A'}, Reason: ${input.reason || 'N/A'}`,
          status: 'pending',
        });

        return { success: true };
      }),

    /**
     * Create Private Checkout for Session (48-hour expiry, one-time use)
     * Only for approved Upgrade requests or invitation token holders
     */
    createSessionCheckout: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const product = PRODUCTS.SESSION;
          const origin = process.env.VITE_FRONTEND_FORGE_API_URL?.replace('/api', '') || 'http://localhost:3000';

          // Generate unique checkout token
          const checkoutToken = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

          // Create Stripe Checkout Session
          const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
              {
                price_data: {
                  currency: product.currency,
                  product_data: {
                    name: product.name,
                    description: product.description,
                  },
                  unit_amount: product.price,
                },
                quantity: 1,
              },
            ],
            mode: 'payment',
            customer_email: input.email,
            metadata: {
              product_type: 'session',
              customer_email: input.email,
              customer_name: input.name || '',
              checkout_token: checkoutToken,
            },
            success_url: `${origin}/session/confirmed?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/pass/upgrade`,
            expires_at: Math.floor(Date.now() / 1000) + 48 * 60 * 60, // 48 hours
          });

          // Calculate expiry date (48 hours from now)
          const expiryDate = new Date();
          expiryDate.setHours(expiryDate.getHours() + 48);

          // Insert Session checkout record
          await insertSessionCheckout({
            email: input.email,
            checkoutToken,
            checkoutUrl: session.url || '',
            expiryDate,
            isUsed: false,
          });

          return { url: session.url };
        } catch (error) {
          console.error('[Session] Failed to create checkout session:', error);
          throw new Error('Session決済URLの発行に失敗しました');
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
