import type { CountryId } from "../data/countries";
import type { GameState } from "./GameState";

export type CountryStrategy =
  | "balanced"
  | "growth"
  | "inflation-control"
  | "social-welfare"
  | "innovation"
  | "exports";

export interface Country {
  readonly id: CountryId;
  readonly name: string;

  playerName?: string;

  isPlayerControlled: boolean;
  strategy: CountryStrategy;

  economy: GameState;
}