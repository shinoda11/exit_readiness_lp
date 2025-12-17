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
