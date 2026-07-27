import type { GameState } from "../../models/GameState";
import type { GameEvent } from "../../models/GameEvent";
import { applyEvent } from "./applyEvent";
import { selectRandomEvent } from "./selectRandomEvent";

export interface RandomEventResult {
  state: GameState;
  event: GameEvent | null;
}

export function applyRandomEvent(
  state: GameState,
  random: () => number = Math.random
): RandomEventResult {
  const event = selectRandomEvent(random);

  if (!event) {
    return {
      state,
      event: null,
    };
  }

  return {
    state: applyEvent(state, event),
    event,
  };
}