import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  testSessions,
  InsertTestSession,
  fitGateResponses,
  InsertFitGateResponse,
  prepModeSubscribers,
  InsertPrepModeSubscriber,
  invitationTokens,
  InsertInvitationToken,
  inviteTokens,
  InsertInviteToken,
  passSubscriptions,
  InsertPassSubscription,
  passOnboarding,
  InsertPassOnboarding,
  upgradeRequests,
  InsertUpgradeRequest,
  sessionCheckouts,
  InsertSessionCheckout,
  notyetFollowup,
  InsertNotyetFollowup,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Insert a new test session application
 */
export async function insertTestSession(entry: InsertTestSession) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(testSessions).values(entry);
  return result;
}

/**
 * Get all test session applications (admin only)
 */
export async function getAllTestSessions() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(testSessions).orderBy(testSessions.createdAt);
}

/**
 * Insert a new Fit Gate response
 */
export async function insertFitGateResponse(entry: InsertFitGateResponse) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(fitGateResponses).values(entry);
  return result;
}

/**
 * Get Fit Gate response by ID
 */
export async function getFitGateResponseById(id: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(fitGateResponses).where(eq(fitGateResponses.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get all Fit Gate responses (admin only)
 */
export async function getAllFitGateResponses() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(fitGateResponses).orderBy(fitGateResponses.createdAt);
}

/**
 * Insert a new Prep Mode subscriber
 */
export async function insertPrepModeSubscriber(entry: InsertPrepModeSubscriber) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(prepModeSubscribers).values(entry);
  return result;
}

/**
 * Get all Prep Mode subscribers (admin only)
 */
export async function getAllPrepModeSubscribers() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(prepModeSubscribers).orderBy(prepModeSubscribers.createdAt);
}

/**
 * Insert a new invitation token
 */
export async function insertInvitationToken(entry: InsertInvitationToken) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(invitationTokens).values(entry);
  return result;
}

/**
 * Get invitation token by token string
 */
export async function getInvitationTokenByToken(tokenStr: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(invitationTokens).where(eq(invitationTokens.token, tokenStr)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Mark invitation token as used
 */
export async function markInvitationTokenAsUsed(tokenStr: string, usedBy: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db
    .update(invitationTokens)
    .set({ isUsed: true, usedBy, usedAt: new Date() })
    .where(eq(invitationTokens.token, tokenStr));
}

/**
 * Get all invitation tokens (admin only)
 */
export async function getAllInvitationTokens() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(invitationTokens).orderBy(invitationTokens.createdAt);
}

/**
 * Insert a new Pass subscription
 */
export async function insertPassSubscription(entry: InsertPassSubscription) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(passSubscriptions).values(entry);
  return result;
}

/**
 * Get Pass subscription by email
 */
export async function getPassSubscriptionByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(passSubscriptions).where(eq(passSubscriptions.email, email)).orderBy(passSubscriptions.createdAt).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get Pass subscription by Stripe Session ID (for idempotency check)
 */
export async function getPassSubscriptionByStripeSessionId(stripeSessionId: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(passSubscriptions).where(eq(passSubscriptions.stripeSessionId, stripeSessionId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Get Pass subscription by Stripe Payment Intent ID (for refund/chargeback handling)
 */
export async function getPassSubscriptionByPaymentIntentId(paymentIntentId: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(passSubscriptions).where(eq(passSubscriptions.stripePaymentIntentId, paymentIntentId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Update Pass subscription status (for refund/chargeback handling)
 */
export async function updatePassSubscriptionStatus(id: number, status: "active" | "expired" | "cancelled") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(passSubscriptions).set({ status }).where(eq(passSubscriptions.id, id));
}

/**
 * Check if user has active Pass subscription
 */
export async function hasActivePassSubscription(email: string): Promise<boolean> {
  const db = await getDb();
  if (!db) {
    return false;
  }

  const result = await db.select().from(passSubscriptions)
    .where(eq(passSubscriptions.email, email))
    .orderBy(passSubscriptions.createdAt);
  
  if (result.length === 0) return false;
  
  const latestSubscription = result[0];
  return latestSubscription.status === 'active' && new Date() < new Date(latestSubscription.expiryDate);
}

/**
 * Insert or update Pass Onboarding progress
 */
export async function upsertPassOnboarding(entry: InsertPassOnboarding) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(passOnboarding).values(entry).onDuplicateKeyUpdate({
    set: {
      task1AppOpened: entry.task1AppOpened ?? false,
      task2CompareViewed: entry.task2CompareViewed ?? false,
      task3MemoGenerated: entry.task3MemoGenerated ?? false,
      completedAt: entry.completedAt,
    },
  });
  return result;
}

/**
 * Get Pass Onboarding progress by email
 */
export async function getPassOnboardingByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(passOnboarding).where(eq(passOnboarding.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Check if user has completed Pass Onboarding
 */
export async function hasCompletedPassOnboarding(email: string): Promise<boolean> {
  const onboarding = await getPassOnboardingByEmail(email);
  if (!onboarding) return false;
  return onboarding.task1AppOpened && onboarding.task2CompareViewed && onboarding.task3MemoGenerated;
}

/**
 * Insert a new Upgrade request
 */
export async function insertUpgradeRequest(entry: InsertUpgradeRequest) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(upgradeRequests).values(entry);
  return result;
}

/**
 * Get all Upgrade requests (admin only)
 */
export async function getAllUpgradeRequests() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  return await db.select().from(upgradeRequests).orderBy(upgradeRequests.createdAt);
}

/**
 * Insert a new Session checkout
 */
export async function insertSessionCheckout(entry: InsertSessionCheckout) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(sessionCheckouts).values(entry);
  return result;
}

/**
 * Get Session checkout by token
 */
export async function getSessionCheckoutByToken(token: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(sessionCheckouts).where(eq(sessionCheckouts.checkoutToken, token)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

/**
 * Insert a new NotYet followup email record
 */
export async function insertNotyetFollowup(entry: InsertNotyetFollowup) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(notyetFollowup).values(entry);
  return result;
}

/**
 * Get NotYet followup emails by fitGateResponseId
 */
export async function getNotyetFollowupByFitGateResponseId(fitGateResponseId: number) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.select().from(notyetFollowup).where(eq(notyetFollowup.fitGateResponseId, fitGateResponseId));
  return result;
}

/**
 * Get all NotYet Fit Gate responses that need 30-day followup email
 * (created 30 days ago, prepBucket=notyet, no followup email sent yet)
 */
export async function getNotyetResponsesNeedingFollowup() {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  // Get all notyet responses from 30 days ago
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const responses = await db.select().from(fitGateResponses)
    .where(eq(fitGateResponses.prepBucket, "notyet"));

  // Filter responses that are 30 days old and have no followup email sent
  const needFollowup = [];
  for (const response of responses) {
    const createdAt = new Date(response.createdAt);
    const daysSinceCreation = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));

    if (daysSinceCreation >= 30) {
      const existingFollowup = await getNotyetFollowupByFitGateResponseId(response.id);
      if (existingFollowup.length === 0) {
        needFollowup.push(response);
      }
    }
  }

  return needFollowup;
}

// ========================================
// Invite Tokens (PASS friend referral)
// ========================================

export async function getInviteTokenByToken(token: string) {
  const db = await getDb();
  if (!db) return null;

  const { eq } = await import("drizzle-orm");
  const result = await db.select().from(inviteTokens).where(eq(inviteTokens.token, token));
  return result.length > 0 ? result[0] : null;
}

export async function markInviteTokenAsUsed(token: string) {
  const db = await getDb();
  if (!db) return;

  const { eq } = await import("drizzle-orm");
  await db
    .update(inviteTokens)
    .set({ isUsed: true, usedAt: new Date() })
    .where(eq(inviteTokens.token, token));
}

export async function isInviteTokenValid(token: string): Promise<boolean> {
  const inviteToken = await getInviteTokenByToken(token);
  if (!inviteToken) return false;
  if (inviteToken.isUsed) return false;
  if (inviteToken.revokedAt) return false;
  if (new Date() > new Date(inviteToken.expiresAt)) return false;
  return true;
}
