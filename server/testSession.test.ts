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

describe("testSession.submit", () => {
  it("should successfully submit a test session application with required fields only", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.testSession.submit({
      email: "test@example.com",
      currentHousing: "賃貸",
      incomeRange: "1500-2000",
      propertyRange: "8000",
      goalMode: "ゆるExit",
    });

    expect(result).toEqual({ success: true });
  });

  it("should successfully submit a test session application with all fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.testSession.submit({
      email: "test2@example.com",
      name: "山田太郎",
      currentHousing: "持ち家",
      incomeRange: "2000-3000",
      propertyRange: "1億以上",
      goalMode: "フルFIRE視野",
      preferredTime: "平日夜",
      notes: "テスト応募です",
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
      caller.testSession.submit({
        email: "invalid-email",
        currentHousing: "賃貸",
        incomeRange: "1500-2000",
        propertyRange: "8000",
        goalMode: "ゆるExit",
      })
    ).rejects.toThrow();
  });

  it("should reject invalid currentHousing value", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.testSession.submit({
        email: "test@example.com",
        currentHousing: "invalid" as any,
        incomeRange: "1500-2000",
        propertyRange: "8000",
        goalMode: "ゆるExit",
      })
    ).rejects.toThrow();
  });

  it("should reject invalid incomeRange value", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.testSession.submit({
        email: "test@example.com",
        currentHousing: "賃貸",
        incomeRange: "invalid" as any,
        propertyRange: "8000",
        goalMode: "ゆるExit",
      })
    ).rejects.toThrow();
  });

  it("should reject invalid propertyRange value", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.testSession.submit({
        email: "test@example.com",
        currentHousing: "賃貸",
        incomeRange: "1500-2000",
        propertyRange: "invalid" as any,
        goalMode: "ゆるExit",
      })
    ).rejects.toThrow();
  });

  it("should reject invalid goalMode value", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.testSession.submit({
        email: "test@example.com",
        currentHousing: "賃貸",
        incomeRange: "1500-2000",
        propertyRange: "8000",
        goalMode: "invalid" as any,
      })
    ).rejects.toThrow();
  });
});
