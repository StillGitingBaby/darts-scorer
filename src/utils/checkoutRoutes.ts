// Checkout routes for X01 games
// This utility provides functions to determine if a score can be checked out
// and suggests possible checkout routes

// Maximum score that can be checked out with 3 darts
export const MAX_CHECKOUT_SCORE = 170;

// Scores that cannot be checked out
export const IMPOSSIBLE_CHECKOUT_SCORES = [169, 168, 166, 165, 163, 162, 159];

// Common checkout routes for scores up to 170
export const CHECKOUT_ROUTES: Record<number, string[]> = {
  170: ['T20 T20 Bull'],
  167: ['T20 T19 Bull'],
  164: ['T20 T18 Bull'],
  161: ['T20 T17 Bull'],
  160: ['T20 T20 D20'],
  158: ['T20 T20 D19'],
  157: ['T20 T19 D20'],
  156: ['T20 T20 D18'],
  155: ['T20 T19 D19'],
  154: ['T20 T18 D20'],
  153: ['T20 T19 D18'],
  152: ['T20 T20 D16'],
  151: ['T20 T17 D20'],
  150: ['T20 T18 D18', 'T19 T19 D18'],
  149: ['T20 T19 D16'],
  148: ['T20 T20 D14'],
  147: ['T20 T17 D18', 'T19 T18 D18'],
  146: ['T20 T18 D16'],
  145: ['T20 T19 D14', 'T19 T20 D14'],
  144: ['T20 T20 D12'],
  143: ['T20 T17 D16', 'T19 T18 D16'],
  142: ['T20 T14 D20', 'T19 T19 D14'],
  141: ['T20 T19 D12', 'T19 T16 D18'],
  140: ['T20 T20 D10'],
  139: ['T20 T13 D20', 'T19 T14 D20'],
  138: ['T20 T18 D12'],
  137: ['T20 T19 D10', 'T19 T16 D16'],
  136: ['T20 T20 D8'],
  135: ['T20 T17 D12', 'T19 T18 D12'],
  134: ['T20 T14 D16', 'T19 T19 D10'],
  133: ['T20 T19 D8'],
  132: ['T20 T16 D12', 'T19 T17 D12'],
  131: ['T20 T13 D16', 'T19 T14 D16'],
  130: ['T20 T18 D8', 'T19 T19 D8'],
  129: ['T19 T16 D12', 'T20 T19 D6'],
  128: ['T20 T16 D10', 'T18 T18 D10'],
  127: ['T20 T17 D8'],
  126: ['T19 T19 D6', 'T20 T14 D12'],
  125: ['T20 T19 D4', 'Bull T20 D20'],
  124: ['T20 T16 D8', 'T18 T18 D8'],
  123: ['T19 T16 D9', 'T20 T13 D12'],
  122: ['T18 T18 D7', 'T20 T12 D13'],
  121: ['T20 T11 D14', 'T19 T14 D8'],
  120: ['T20 S20 D20'],
  119: ['T19 T12 D13', 'T20 S19 D20'],
  118: ['T20 S18 D20', 'T18 T16 D8'],
  117: ['T20 S17 D20', 'T19 S20 D20'],
  116: ['T20 S16 D20', 'T19 S19 D20'],
  115: ['T20 S15 D20', 'T19 S18 D20'],
  114: ['T20 S14 D20', 'T19 S17 D20'],
  113: ['T20 S13 D20', 'T19 S16 D20'],
  112: ['T20 S12 D20', 'T19 S15 D20'],
  111: ['T20 S11 D20', 'T19 S14 D20'],
  110: ['T20 S10 D20', 'T19 S13 D20'],
  109: ['T20 S9 D20', 'T19 S12 D20'],
  108: ['T20 S8 D20', 'T19 S11 D20'],
  107: ['T20 S7 D20', 'T19 S10 D20'],
  106: ['T20 S6 D20', 'T19 S9 D20'],
  105: ['T20 S5 D20', 'T19 S8 D20'],
  104: ['T20 S4 D20', 'T19 S7 D20'],
  103: ['T20 S3 D20', 'T19 S6 D20'],
  102: ['T20 S2 D20', 'T19 S5 D20'],
  101: ['T20 S1 D20', 'T19 S4 D20'],
  100: ['T20 D20', 'T19 S3 D20'],
  99: ['T19 S10 D16', 'T20 S7 D18'],
  98: ['T20 D19', 'T19 S9 D16'],
  97: ['T19 D20', 'T20 S5 D18'],
  96: ['T20 D18', 'T19 S7 D16'],
  95: ['T19 D19', 'T20 S3 D18'],
  94: ['T18 D20', 'T20 D17'],
  93: ['T19 D18', 'T17 D21'],
  92: ['T20 D16', 'T16 D22'],
  91: ['T17 D20', 'T19 D17'],
  90: ['T20 D15', 'T18 D18'],
  89: ['T19 D16', 'T17 D19'],
  88: ['T20 D14', 'T16 D20'],
  87: ['T17 D18', 'T19 D15'],
  86: ['T18 D16', 'T14 D22'],
  85: ['T15 D20', 'T19 D14'],
  84: ['T20 D12', 'T16 D18'],
  83: ['T17 D16', 'T19 D13'],
  82: ['T14 D20', 'T18 D14'],
  81: ['T19 D12', 'T15 D18'],
  80: ['T20 D10', 'T16 D16'],
  79: ['T19 D11', 'T13 D20'],
  78: ['T18 D12', 'T14 D18'],
  77: ['T19 D10', 'T15 D16'],
  76: ['T20 D8', 'T16 D14'],
  75: ['T17 D12', 'T13 D18'],
  74: ['T14 D16', 'T18 D10'],
  73: ['T19 D8', 'T11 D20'],
  72: ['T16 D12', 'T12 D18'],
  71: ['T13 D16', 'T17 D10'],
  70: ['T18 D8', 'T10 D20'],
  69: ['T19 D6', 'T15 D12'],
  68: ['T20 D4', 'T16 D10'],
  67: ['T17 D8', 'T9 D20'],
  66: ['T10 D18', 'T16 D9'],
  65: ['T19 D4', 'T15 D10'],
  64: ['T16 D8', 'T8 D20'],
  63: ['T13 D12', 'T17 D6'],
  62: ['T10 D16', 'T12 D13'],
  61: ['T15 D8', 'T13 D11'],
  60: ['S20 D20', 'T20 D0'],
  59: ['S19 D20', 'T13 D10'],
  58: ['S18 D20', 'T10 D14'],
  57: ['S17 D20', 'T19 D0'],
  56: ['S16 D20', 'T8 D16'],
  55: ['S15 D20', 'T13 D8'],
  54: ['S14 D20', 'T18 D0'],
  53: ['S13 D20', 'T17 D1'],
  52: ['S12 D20', 'T12 D8'],
  51: ['S11 D20', 'T17 D0'],
  50: ['S10 D20', 'T10 D10'],
  49: ['S9 D20', 'T13 D5'],
  48: ['S8 D20', 'T16 D0'],
  47: ['S7 D20', 'T15 D1'],
  46: ['S6 D20', 'T10 D8'],
  45: ['S5 D20', 'T15 D0'],
  44: ['S4 D20', 'T8 D10'],
  43: ['S3 D20', 'T13 D2'],
  42: ['S10 D16', 'T14 D0'],
  41: ['S9 D16', 'T13 D1'],
  40: ['D20'],
  39: ['S7 D16', 'S19 D10'],
  38: ['D19'],
  37: ['S5 D16', 'S17 D10'],
  36: ['D18'],
  35: ['S3 D16', 'S15 D10'],
  34: ['D17'],
  33: ['S1 D16', 'S13 D10'],
  32: ['D16'],
  31: ['S15 D8', 'S7 D12'],
  30: ['D15'],
  29: ['S13 D8', 'S5 D12'],
  28: ['D14'],
  27: ['S11 D8', 'S3 D12'],
  26: ['D13'],
  25: ['S9 D8', 'S1 D12'],
  24: ['D12'],
  23: ['S7 D8', 'S19 D2'],
  22: ['D11'],
  21: ['S5 D8', 'S17 D2'],
  20: ['D10'],
  19: ['S3 D8', 'S15 D2'],
  18: ['D9'],
  17: ['S1 D8', 'S13 D2'],
  16: ['D8'],
  15: ['S7 D4', 'S11 D2'],
  14: ['D7'],
  13: ['S5 D4', 'S9 D2'],
  12: ['D6'],
  11: ['S3 D4', 'S7 D2'],
  10: ['D5'],
  9: ['S1 D4', 'S5 D2'],
  8: ['D4'],
  7: ['S3 D2', 'S1 D3'],
  6: ['D3'],
  5: ['S1 D2', 'S3 D1'],
  4: ['D2'],
  3: ['S1 D1'],
  2: ['D1'],
  1: ['S1 D0'],
};

/**
 * Determines if a score can be checked out
 * @param score The current score
 * @returns boolean indicating if the score can be checked out
 */
export const isCheckoutPossible = (score: number): boolean => {
  // Score must be 170 or less
  if (score > MAX_CHECKOUT_SCORE) return false;

  // Score must not be in the impossible checkout list
  if (IMPOSSIBLE_CHECKOUT_SCORES.includes(score)) return false;

  // Score must be even or have a possible checkout route
  return score % 2 === 0 || CHECKOUT_ROUTES[score] !== undefined;
};

/**
 * Gets possible checkout routes for a score
 * @param score The current score
 * @returns Array of possible checkout routes or null if checkout is not possible
 */
export const getCheckoutRoutes = (score: number): string[] | null => {
  if (!isCheckoutPossible(score)) return null;

  // Return predefined routes if available
  if (CHECKOUT_ROUTES[score]) return CHECKOUT_ROUTES[score];

  // For even scores without predefined routes, suggest a simple double
  if (score % 2 === 0 && score <= 40) {
    return [`D${score / 2}`];
  }

  // For other scores, return a generic suggestion
  return ['Checkout possible'];
};
