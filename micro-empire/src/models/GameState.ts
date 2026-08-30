import type { Firm } from "./Firm";
import type { Market } from "./Market";

export interface GameState {
  year: number;
  quarter: number;

  cash: number;

  market: Market;
  firm: Firm;
}