import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { insertTestSession } from "./db";
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
});

export type AppRouter = typeof appRouter;
