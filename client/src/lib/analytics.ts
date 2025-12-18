/**
 * Analytics utility for tracking user events
 * Uses Umami analytics (already configured in index.html)
 */

declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, any>) => void;
    };
  }
}

/**
 * Track a custom event
 * @param eventName - The name of the event to track
 * @param eventData - Optional additional data to send with the event
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  // Umami tracking
  if (typeof window !== 'undefined' && window.umami) {
    window.umami.track(eventName, eventData);
  }

  // Console log in development
  if (import.meta.env.DEV) {
    console.log('[Analytics]', eventName, eventData);
  }
}

// Predefined event names for type safety
// 京都モデル v0.3.1 仕様に準拠
export const AnalyticsEvents = {
  // Landing Page
  LP_VIEW: 'lp_view',
  LP_HERO_CTA_CLICKED: 'lp_hero_cta_clicked',
  
  // Fit Gate
  FITGATE_STARTED: 'fitgate_started',
  FITGATE_SUBMITTED: 'fitgate_submitted',
  FITGATE_RESULT_READY: 'fitgate_result_ready',
  FITGATE_RESULT_PREP_NEAR: 'fitgate_result_prep_near',
  FITGATE_RESULT_PREP_NOTYET: 'fitgate_result_prep_notyet',
  FITGATE_RESULT_SESSION_UNLOCKED: 'fitgate_result_session_unlocked',
  
  // Pass
  PASS_CHECKOUT_OPENED: 'pass_checkout_opened',
  PASS_PAYMENT_SUCCESS: 'pass_payment_success',
  
  // Onboarding
  ONBOARDING_COMPLETED: 'onboarding_completed',
  
  // Upgrade
  UPGRADE_REQUEST_SUBMITTED: 'upgrade_request_submitted',
} as const;
