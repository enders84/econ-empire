import type { GameEvent } from "../../models/GameEvent.ts";
import { events } from "../../data/events.ts";

const EVENT_CHANCE = 0.3;

export function selectRandomEvent(
  random: () => number = Math.random
): GameEvent | null {
  const eventOccurs =
    random() <= EVENT_CHANCE;

  if (!eventOccurs) {
    return null;
  }

  const eventIndex = Math.floor(
    random() * events.length
  );

  return events[eventIndex] ?? null;
}