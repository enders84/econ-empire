import type { GameState } from "../../models/GameState";

import {
  calculateMarginalRevenue,
  priceForQuantity,
} from "../firm/calculateMarginalRevenue";

export interface MonopolyResult {
  price: number;
  quantityDemanded: number;
  marginalRevenue: number;
}

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function runMonopoly(
  state: GameState,
): MonopolyResult {
  /*
   * The monopolist chooses quantity.
   *
   * The market demand curve determines
   * the highest price consumers will pay
   * for that quantity.
   */
  const quantity =
    Math.min(
      Math.max(
        state.firm.production,
        0,
      ),
      state.market.marketSize,
    );

  /*
   * Use the SAME inverse-demand equation
   * used by the Demand and Revenue graphs.
   */
  const price =
    priceForQuantity(
      state,
      quantity,
    );

  /*
   * Use the SAME marginal-revenue equation
   * used by the MR vs. MC graph.
   */
  const marginalRevenue =
    calculateMarginalRevenue(
      state,
      quantity,
    );

  return {
    price: round(price),

    quantityDemanded:
      round(quantity),

    marginalRevenue:
      round(marginalRevenue),
  };
}