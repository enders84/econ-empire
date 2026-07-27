import type { GameEvent } from "../models/GameEvent";

export const events: readonly GameEvent[] = [
  {
    name: "Technology Boom",
    description: "Domestic innovation increases productivity.",
    effects: {
      gdp: 15,
      inflation: -0.2,
      unemployment: -0.4,
      approval: 2,
    },
  },

  {
    name: "Oil Price Shock",
    description: "Global oil prices increase dramatically.",
    effects: {
      gdp: -10,
      inflation: 1.5,
      unemployment: 0.5,
      approval: -3,
    },
  },

  {
    name: "Trade Agreement",
    description: "Exports increase after a major trade deal.",
    effects: {
      gdp: 10,
      inflation: 0,
      unemployment: -0.3,
      approval: 2,
    },
  },

  {
    name: "Banking Crisis",
    description: "Major banks require emergency assistance.",
    effects: {
      gdp: -20,
      inflation: 0.5,
      unemployment: 1,
      approval: -5,
    },
  },
];