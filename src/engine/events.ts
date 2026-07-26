import type { GameState } from "../models/GameState";
import type { GameEvent } from "../models/GameEvent";

const events: GameEvent[] = [
  {
    name: "Technology Boom",
    description:
      "Domestic innovation increases productivity.",

    gdp: 15,
    inflation: -0.2,
    unemployment: -0.4,
    approval: 2,
  },

  {
    name: "Oil Price Shock",
    description:
      "Global oil prices increase dramatically.",

    gdp: -10,
    inflation: 1.5,
    unemployment: 0.5,
    approval: -3,
  },

  {
    name: "Trade Agreement",
    description:
      "Exports increase after a major trade deal.",

    gdp: 10,
    inflation: 0,
    unemployment: -0.3,
    approval: 2,
  },

  {
    name: "Banking Crisis",
    description:
      "Major banks require emergency assistance.",

    gdp: -20,
    inflation: 0.5,
    unemployment: 1,
    approval: -5,
  },
];

export function applyRandomEvent(
  next: GameState
): GameEvent | null {
  // 30% chance of an event
  if (Math.random() > 0.30) {
    return null;
  }

  const event =
    events[Math.floor(Math.random() * events.length)];

  next.gdp += event.gdp;
  next.inflation += event.inflation;
  next.unemployment += event.unemployment;
  next.approval += event.approval;

  return event;
}