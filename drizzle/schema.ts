import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 1on1 test session applications table
 */
export const testSessions = mysqlTable("testSessions", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  currentHousing: mysqlEnum("currentHousing", ["賃貸", "持ち家"]).notNull(),
  incomeRange: mysqlEnum("incomeRange", ["1000-1500", "1500-2000", "2000-3000", "3000以上"]).notNull(),
  propertyRange: mysqlEnum("propertyRange", ["賃貸継続", "6000", "8000", "1億以上"]).notNull(),
  goalMode: mysqlEnum("goalMode", ["守り", "ゆるExit", "フルFIRE視野"]).notNull(),
  preferredTime: varchar("preferredTime", { length: 64 }),
  notes: text("notes"),
  
  // UTM parameters
  utmSource: varchar("utmSource", { length: 255 }),
  utmMedium: varchar("utmMedium", { length: 255 }),
  utmCampaign: varchar("utmCampaign", { length: 255 }),
  utmContent: varchar("utmContent", { length: 255 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TestSession = typeof testSessions.$inferSelect;
export type InsertTestSession = typeof testSessions.$inferInsert;

/**
 * Fit Gate 12-question responses table
 */
export const fitGateResponses = mysqlTable("fitGateResponses", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 64 }).notNull(),
  email: varchar("email", { length: 320 }),
  q1DecisionDeadline: varchar("q1DecisionDeadline", { length: 64 }),
  q2HousingStatus: varchar("q2HousingStatus", { length: 64 }),
  q3PriceRange: varchar("q3PriceRange", { length: 64 }),
  q4IncomeRange: varchar("q4IncomeRange", { length: 64 }),
  q5AssetRange: varchar("q5AssetRange", { length: 64 }),
  q6NumberInputTolerance: varchar("q6NumberInputTolerance", { length: 128 }),
  q7CareerChange: varchar("q7CareerChange", { length: 128 }),
  q8LifeEvent: varchar("q8LifeEvent", { length: 128 }),
  q9CurrentQuestion: varchar("q9CurrentQuestion", { length: 255 }),
  q10PreferredApproach: varchar("q10PreferredApproach", { length: 128 }),
  q11PrivacyConsent: boolean("q11PrivacyConsent").notNull(),
  q12BudgetSense: varchar("q12BudgetSense", { length: 64 }),
  invitationToken: varchar("invitationToken", { length: 64 }),
  judgmentResult: mysqlEnum("judgmentResult", ["prep", "pass", "session"]),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type FitGateResponse = typeof fitGateResponses.$inferSelect;
export type InsertFitGateResponse = typeof fitGateResponses.$inferInsert;

/**
 * Prep Mode subscribers (newsletter/preparation guidance)
 */
export const prepModeSubscribers = mysqlTable("prepModeSubscribers", {
  id: int("id").autoincrement().primaryKey(),
  email: varchar("email", { length: 320 }).notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PrepModeSubscriber = typeof prepModeSubscribers.$inferSelect;
export type InsertPrepModeSubscriber = typeof prepModeSubscribers.$inferInsert;

/**
 * Invitation tokens for Session access
 */
export const invitationTokens = mysqlTable("invitationTokens", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 64 }).notNull().unique(),
  isUsed: boolean("isUsed").default(false).notNull(),
  usedBy: varchar("usedBy", { length: 320 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  usedAt: timestamp("usedAt"),
});

export type InvitationToken = typeof invitationTokens.$inferSelect;
export type InsertInvitationToken = typeof invitationTokens.$inferInsert;