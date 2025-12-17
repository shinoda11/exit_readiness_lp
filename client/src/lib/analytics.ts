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
export const AnalyticsEvents = {
  // Hero section
  LP_HERO_CTA_CLICKED: 'lp_hero_cta_clicked',
  
  // Fit Gate
  FITGATE_STARTED: 'fitgate_started',
  FITGATE_SUBMITTED: 'fitgate_submitted',
  FITGATE_RESULT_SESSION: 'fitgate_result_session',
  FITGATE_RESULT_PREP: 'fitgate_result_prep',
  FITGATE_RESULT_NOTYET: 'fitgate_result_notyet',
  
  // Prep Mode
  PREP_REGISTERED: 'prep_registered',
  
  // Session
  SESSION_CTA_CLICKED: 'session_cta_clicked',
  SESSION_FORM_SUBMITTED: 'session_form_submitted',
} as const;
