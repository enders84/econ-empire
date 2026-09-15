import type { GameEvent } from "./Event";

export interface ActiveEvent {
  event: GameEvent;
  remainingQuarters: number;
}