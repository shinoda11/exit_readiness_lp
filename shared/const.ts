export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = 'Please login (10001)';
export const NOT_ADMIN_ERR_MSG = 'You do not have required permission (10002)';

/**
 * Feature Flag: Friend Invite LP
 * 
 * 本番環境では必ずfalseに設定してください。
 * 友人紹介LP導線は「実装は残してよいが、提供はしない」方針です。
 * 
 * - true: 友人紹介LP導線を有効化（開発環境のみ）
 * - false: 友人紹介LP導線を無効化（本番環境）
 */
export const FRIEND_INVITE_ENABLED = process.env.FRIEND_INVITE_ENABLED === 'true';

/**
 * Feature Flag: Test Mode
 * 
 * 本番環境では必ずfalseに設定してください。
 * 開発・レビュー時にFit Gateをスキップしてユーザー体験を確認できるようにします。
 * 
 * - true: テストモードを有効化（開発環境のみ）
 * - false: テストモードを無効化（本番環境）
 */
export const TEST_MODE = process.env.TEST_MODE === 'true';

/**
 * Test Session IDs for skipping Fit Gate
 * 
 * テストモードが有効な場合、以下のセッションIDを使ってFit Gateをスキップできます。
 * - test_ready: Ready判定結果を表示
 * - test_prep_near: Prep Near判定結果を表示
 * - test_prep_notyet: Prep NotYet判定結果を表示
 */
export const TEST_SESSION_IDS = {
  READY: 'test_ready',
  PREP_NEAR: 'test_prep_near',
  PREP_NOTYET: 'test_prep_notyet',
} as const;

/**
 * Check if the given session ID is a test session ID
 */
export function isTestSessionId(sessionId: string | null | undefined): boolean {
  if (!sessionId) return false;
  return Object.values(TEST_SESSION_IDS).includes(sessionId as any);
}
