import type { GameState } from "./GameState";

export type EventEffects = Partial<
  Pick<
    GameState,
    | "gdp"
    | "inflation"
    | "unemployment"
    | "approval"
    | "debt"
  >
>;

export interface GameEvent {
  readonly name: string;
  readonly description: string;

  readonly effects: EventEffects;
}