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
    },

    firm: {
      name: "Empire Coffee",

      price: 5,

      production: 10000,
      advertising: 0,
      brandStrength: 0,

      unitsSold: 0,

      revenue: 0,

      fixedCosts: 10000,

      variableCostPerUnit: 2,

      totalCosts: 0,

      profit: 0,

      marketShare: 0,
    },
  };
}