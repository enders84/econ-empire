export type GameMode =
  | "Learning"
  | "Tournament";

export interface CompetitionState {
  mode: GameMode;
  enabled: boolean;
  totalQuarters: number;
  quartersPlayed: number;
  score: number;
  isFinished: boolean;
}