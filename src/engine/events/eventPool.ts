import type { GameEvent } from "../../models/Event";

export const eventPool: GameEvent[] = [
  {
    id: "oil_shock",

    title: "Oil Price Shock",

    description:
      "Global energy prices surged this quarter.",

    weight: 10,

    duration: 3,

    effects: {
      inflation: 0.5,
      gdp: -0.6,
      approval: -1,
    },
  },

  {
    id: "ai_boom",

    title: "AI Productivity Boom",

    description:
      "Businesses rapidly adopted new AI technologies.",

    weight: 8,

    duration: 4,

    effects: {
      productivity: 0.005,
      gdp: 0.8,
    },
  },

  {
    id: "consumer_confidence",

    title: "Consumer Confidence",

    description:
      "Households increased spending.",

    weight: 12,

    duration: 1,

    effects: {
      gdp: 0.4,
      approval: 0.5,
    },
  },
];