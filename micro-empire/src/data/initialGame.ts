import type { GameState } from "../models/GameState";

export function createInitialGame(): GameState {
  return {
    year: 1,
    quarter: 1,

    cash: 500000,

    market: {
      name: "Coffee Market",

      structure:
        "Monopolistic Competition",

      baseDemand: 10000,

      priceElasticity: 1.5,

      marketSize: 50000,

      averageMarketPrice: 5,

      /*
       * Start with several differentiated
       * firms competing in the market.
       */
      numberOfFirms: 10,

      /*
       * Positive values will represent
       * pressure for firms to enter.
       *
       * Negative values will represent
       * pressure for firms to exit.
       */
      entryExitPressure: 0,
      firmsEntered: 0,
      firmsExited: 0,
      /*
 * OLIGOPOLY STARTING CONDITIONS
 *
 * Rivals begin at the normal market price
 * with no active price war.
 */
rivalPrice: 5,

previousRivalPrice: 5,

priceWarPressure: 0,

rivalReaction: "Stable",
    },

    firm: {
      name: "Empire Coffee",

      price: 5,

      production: 10000,

      /*
       * Advertising begins at zero.
       */
      advertising: 0,

      /*
       * Brand Strength 20 is our baseline.
       *
       * This matches the demand calculations
       * we already built for Monopolistic
       * Competition.
       */
      brandStrength: 20,

      unitsSold: 0,

      revenue: 0,

      fixedCosts: 10000,

      variableCostPerUnit: 2,

      totalCosts: 0,

      profit: 0,

      marketShare: 0,
    },
     /*
     * ========================================
     * LEARNING CHALLENGES
     * ========================================
     *
     * No challenge is active when a new
     * game begins.
     */
    challenges: {
      activeChallengeId: null,
      completedChallengeIds: [],
    },
    competition: {
  enabled: true,

  totalQuarters: 12,

  quartersPlayed: 0,

  score: 0,

  isFinished: false,
},
  };
}
