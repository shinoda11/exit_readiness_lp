import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { insertWaitlistEntry } from "./db";
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

  waitlist: router({
    submit: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          currentHousing: z.enum(["賃貸", "持ち家"]),
          purchaseStatus: z.enum(["検討中", "未検討", "購入済"]),
          incomeRange: z.string().optional(),
          propertyRange: z.string().optional(),
          workStyle: z.string().optional(),
          interests: z.array(z.string()).optional(),
          oneOnOneInterest: z.boolean().optional(),
          utmSource: z.string().optional(),
          utmMedium: z.string().optional(),
          utmCampaign: z.string().optional(),
          utmContent: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const entry = {
          ...input,
          interests: input.interests ? JSON.stringify(input.interests) : null,
        };
        await insertWaitlistEntry(entry);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
