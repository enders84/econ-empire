import type { GameEvent } from "../../models/Event";
import { eventPool } from "./eventPool";

export function selectRandomEvent():
  | GameEvent
  | null {
  // 20% chance that any event occurs this quarter.
  if (Math.random() > 0.20) {
    return null;
  }

  const totalWeight = eventPool.reduce(
    (sum, event) => sum + event.weight,
    0,
  );

  let random =
    Math.random() * totalWeight;

  for (const event of eventPool) {
    random -= event.weight;

    if (random <= 0) {
      return event;
    }
  }

  return null;
}