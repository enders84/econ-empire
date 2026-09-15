import type { Firm } from "./Firm";
import type { Market } from "./Market";
import type { ChallengeState } from "./Challenge";
import type { CompetitionState } from "./Competition";

export interface GameState {
  year: number;
  quarter: number;

  cash: number;

  market: Market;
  firm: Firm;

  challenges: ChallengeState;
  competition: CompetitionState;
}