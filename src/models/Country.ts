import type { GameState } from "./GameState";

export type CountryId =
  | "united-states"
  | "china"
  | "japan"
  | "germany"
  | "india"
  | "united-kingdom"
  | "france"
  | "canada"
  | "mexico"
  | "brazil"
  | "australia"
  | "south-korea";

export type CountryStrategy =
  | "balanced"
  | "growth"
  | "inflation-control"
  | "social-welfare"
  | "innovation"
  | "exports";

export interface Country {
  id: CountryId;
  name: string;
  flag: string;

  playerName?: string;

  isPlayerControlled: boolean;

  strategy: CountryStrategy;

  economy: GameState;
}