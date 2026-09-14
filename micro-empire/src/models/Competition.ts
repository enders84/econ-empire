import type { MarketStructure } from "./Market";

export type GameMode =
  | "Learning"
  | "Tournament";

export interface CompetitionState {
  mode: GameMode;
  enabled: boolean;
  totalQuarters: number;
  quartersPlayed: number;
  cumulativeProfit: number;
  marketStructuresUsed: MarketStructure[];
  score: number;
  isFinished: boolean;
}
