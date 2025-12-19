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
