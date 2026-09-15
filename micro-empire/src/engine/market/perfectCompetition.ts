import type { GameState } from "../../models/GameState";

export interface PerfectCompetitionResult {
  marketPrice: number;
  marginalRevenue: number;
  quantityDemanded: number;
}

export function runPerfectCompetition(
  state: GameState,
): PerfectCompetitionResult {
  const marketPrice =
    state.market.averageMarketPrice;

  /*
   * A perfectly competitive firm is a price taker.
   * Therefore:
   *
   * P = MR
   */
  const marginalRevenue =
    marketPrice;

  /*
   * For now, assume the individual firm can sell
   * all of its production at the market price.
   *
   * Later, industry supply and demand will determine
   * the market price dynamically.
   */
  const quantityDemanded =
    state.firm.production;

  return {
    marketPrice,
    marginalRevenue,
    quantityDemanded,
  };
}