import { describe, it, expect } from 'vitest';
import { TEST_SESSION_IDS, isTestSessionId } from '@shared/const';

describe('Test Mode', () => {
  describe('isTestSessionId', () => {
    it('should return true for valid test session IDs', () => {
      expect(isTestSessionId(TEST_SESSION_IDS.READY)).toBe(true);
      expect(isTestSessionId(TEST_SESSION_IDS.PREP_NEAR)).toBe(true);
      expect(isTestSessionId(TEST_SESSION_IDS.PREP_NOTYET)).toBe(true);
    });

    it('should return false for invalid test session IDs', () => {
      expect(isTestSessionId('invalid_session_id')).toBe(false);
      expect(isTestSessionId('test_invalid')).toBe(false);
      expect(isTestSessionId('')).toBe(false);
    });

    it('should return false for null or undefined', () => {
      expect(isTestSessionId(null)).toBe(false);
      expect(isTestSessionId(undefined)).toBe(false);
    });
  });

  describe('TEST_SESSION_IDS', () => {
    it('should have correct test session IDs', () => {
      expect(TEST_SESSION_IDS.READY).toBe('test_ready');
      expect(TEST_SESSION_IDS.PREP_NEAR).toBe('test_prep_near');
      expect(TEST_SESSION_IDS.PREP_NOTYET).toBe('test_prep_notyet');
    });

    it('should have 3 test session IDs', () => {
      expect(Object.keys(TEST_SESSION_IDS).length).toBe(3);
    });
  });
});
