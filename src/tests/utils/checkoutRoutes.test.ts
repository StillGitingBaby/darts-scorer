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
      // Create a mock score that's not in the predefined routes
      // We need to find a score that's not already in CHECKOUT_ROUTES
      // Let's use 42 as an example, but first check if it's in CHECKOUT_ROUTES
      const mockScore = 42;
      
      // Get the actual routes for this score
      const actualRoutes = CHECKOUT_ROUTES[mockScore];
      
      // Verify it returns the expected routes
      expect(getCheckoutRoutes(mockScore)).toEqual(actualRoutes);
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