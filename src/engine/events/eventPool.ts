import type { GameEvent } from "../../models/Event";

export const eventPool: GameEvent[] = [
  {
    id: "oil_shock",

    title: "Oil Price Shock",

    description:
      "Global energy prices surged this quarter.",

    probability: 0.10,

    effects: {
      inflation: 1,
      gdp: -1,
      approval: -2,
    },
  },

  {
    id: "ai_boom",

    title: "AI Productivity Boom",

    description:
      "Businesses rapidly adopted new AI technologies.",

    probability: 0.08,

    effects: {
      productivity: 0.03,
      gdp: 1.5,
    },
  },

  {
    id: "consumer_confidence",

    title: "Consumer Confidence",

    description:
      "Households increased spending.",

    probability: 0.12,

    effects: {
      gdp: 0.8,
      approval: 1,
    },
  },
];