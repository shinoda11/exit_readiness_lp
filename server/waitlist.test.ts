import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createPublicContext(): TrpcContext {
  return {
    user: undefined,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("waitlist.submit", () => {
  it("should successfully submit a waitlist entry with required fields only", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.waitlist.submit({
      email: "test@example.com",
      currentHousing: "賃貸",
      purchaseStatus: "検討中",
    });

    expect(result).toEqual({ success: true });
  });

  it("should successfully submit a waitlist entry with all fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.waitlist.submit({
      email: "test2@example.com",
      currentHousing: "持ち家",
      purchaseStatus: "購入済",
      incomeRange: "1500-2000",
      propertyRange: "8000",
      workStyle: "ゆるExit",
      interests: ["住宅購入", "働き方を緩める"],
      oneOnOneInterest: true,
      utmSource: "twitter",
      utmMedium: "social",
      utmCampaign: "launch",
      utmContent: "hero",
    });

    expect(result).toEqual({ success: true });
  });

  it("should reject invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.waitlist.submit({
        email: "invalid-email",
        currentHousing: "賃貸",
        purchaseStatus: "検討中",
      })
    ).rejects.toThrow();
  });

  it("should reject invalid currentHousing value", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.waitlist.submit({
        email: "test@example.com",
        currentHousing: "invalid" as any,
        purchaseStatus: "検討中",
      })
    ).rejects.toThrow();
  });

  it("should reject invalid purchaseStatus value", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.waitlist.submit({
        email: "test@example.com",
        currentHousing: "賃貸",
        purchaseStatus: "invalid" as any,
      })
    ).rejects.toThrow();
  });
});
