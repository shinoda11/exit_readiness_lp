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
} from "./db";
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
        let judgmentResult: "prep" | "pass" | "session" = "prep";

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
          judgmentResult = "pass";
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
});

export type AppRouter = typeof appRouter;
