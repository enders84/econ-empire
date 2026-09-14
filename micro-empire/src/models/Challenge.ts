import type { MarketStructure } from "./Market";

export type ChallengeStatus =
  | "Not Started"
  | "In Progress"
  | "Completed";


export interface Challenge {
  id: string;

  title: string;

  description: string;

  marketStructure: MarketStructure;

  status: ChallengeStatus;

  successMessage: string;
}

export type GameMode =
  | "Learning"
  | "Tournament";

export interface ChallengeState {
  activeChallengeId: string | null;

  completedChallengeIds: string[];
}