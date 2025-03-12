import {
  MAX_CHECKOUT_SCORE,
  IMPOSSIBLE_CHECKOUT_SCORES,
  isCheckoutPossible,
  getCheckoutRoutes,
  CHECKOUT_ROUTES,
} from '../../utils/checkoutRoutes';

describe('checkoutRoutes utility', () => {
  describe('isCheckoutPossible', () => {
    it('should return true for valid checkout scores', () => {
      // Test some common checkout scores
      expect(isCheckoutPossible(170)).toBe(true); // Maximum checkout
      expect(isCheckoutPossible(40)).toBe(true); // Common checkout
      expect(isCheckoutPossible(32)).toBe(true); // Common checkout
      expect(isCheckoutPossible(2)).toBe(true); // Minimum checkout

      // Test some odd numbers that can be checked out
      expect(isCheckoutPossible(39)).toBe(true);
      expect(isCheckoutPossible(25)).toBe(true);
      expect(isCheckoutPossible(3)).toBe(true);
      expect(isCheckoutPossible(1)).toBe(true);
    });

    it('should return false for scores above MAX_CHECKOUT_SCORE', () => {
      expect(isCheckoutPossible(171)).toBe(false);
      expect(isCheckoutPossible(180)).toBe(false);
      expect(isCheckoutPossible(200)).toBe(false);
    });

    it('should return false for impossible checkout scores', () => {
      // Test all impossible checkout scores
      IMPOSSIBLE_CHECKOUT_SCORES.forEach(score => {
        expect(isCheckoutPossible(score)).toBe(false);
      });
    });
  });

  describe('getCheckoutRoutes', () => {
    it('should return null for scores that cannot be checked out', () => {
      expect(getCheckoutRoutes(171)).toBeNull();
      expect(getCheckoutRoutes(169)).toBeNull(); // Impossible checkout
    });

    it('should return predefined routes for common checkout scores', () => {
      // Test some predefined checkout routes
      expect(getCheckoutRoutes(170)).toEqual(['T20 T20 Bull']);
      expect(getCheckoutRoutes(40)).toEqual(['D20']);
      expect(getCheckoutRoutes(32)).toEqual(['D16']);
    });

    it('should return simple double suggestions for even scores without predefined routes', () => {
      // Find an even score <= 40 that's not in the predefined routes
      let testScore = 38;
      while (CHECKOUT_ROUTES[testScore] && testScore > 0) {
        testScore -= 2;
      }
      
      // If we found a suitable test score
      if (testScore > 0 && !CHECKOUT_ROUTES[testScore]) {
        expect(getCheckoutRoutes(testScore)).toEqual([`D${testScore / 2}`]);
      } else {
        // Manually create a test case by temporarily removing a score from CHECKOUT_ROUTES
        const originalRoutes = CHECKOUT_ROUTES[38];
        delete CHECKOUT_ROUTES[38];
        
        try {
          expect(getCheckoutRoutes(38)).toEqual(['D19']);
        } finally {
          // Restore the original routes
          if (originalRoutes) {
            CHECKOUT_ROUTES[38] = originalRoutes;
          }
        }
      }
    });

    it('should return a generic suggestion for scores without predefined routes that are not even or <= 40', () => {
      // We need to test an odd score that's not in IMPOSSIBLE_CHECKOUT_SCORES
      // and not in CHECKOUT_ROUTES
      // Let's use a score that's even (so it passes isCheckoutPossible) but > 40
      const testScore = 42; // Even number > 40
      
      // Make sure it's not already in CHECKOUT_ROUTES
      if (!CHECKOUT_ROUTES[testScore]) {
        expect(getCheckoutRoutes(testScore)).toEqual(['Checkout possible']);
      } else {
        // Temporarily remove it from CHECKOUT_ROUTES
        const originalRoutes = CHECKOUT_ROUTES[testScore];
        delete CHECKOUT_ROUTES[testScore];
        
        try {
          expect(getCheckoutRoutes(testScore)).toEqual(['Checkout possible']);
        } finally {
          // Restore the original routes
          if (originalRoutes) {
            CHECKOUT_ROUTES[testScore] = originalRoutes;
          }
        }
      }
    });

    it('should handle odd number checkouts correctly', () => {
      // Test some odd number checkouts
      expect(getCheckoutRoutes(39)).toEqual(['S7 D16', 'S19 D10']);
      expect(getCheckoutRoutes(27)).toEqual(['S11 D8', 'S3 D12']);
      expect(getCheckoutRoutes(3)).toEqual(['S1 D1']);
    });
  });

  describe('Constants', () => {
    it('should define MAX_CHECKOUT_SCORE as 170', () => {
      expect(MAX_CHECKOUT_SCORE).toBe(170);
    });

    it('should include all known impossible checkout scores', () => {
      // These are the standard impossible checkout scores in darts
      const knownImpossibles = [169, 168, 166, 165, 163, 162, 159];

      // Verify all known impossibles are included
      knownImpossibles.forEach(score => {
        expect(IMPOSSIBLE_CHECKOUT_SCORES).toContain(score);
      });
    });
  });
});
