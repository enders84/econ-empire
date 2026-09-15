import type { GameState } from "../../models/GameState";
import type { Challenge } from "../../models/Challenge";

import { calculateCosts } from "../firm/calculateCosts";
import { calculateMarginalRevenue } from "../firm/calculateMarginalRevenue";

export function evaluateChallenge(
  challenge: Challenge,
  state: GameState,
): boolean {
  /*
   * A challenge can only be completed while
   * the player is operating in the market
   * structure associated with that challenge.
   */
  if (
    state.market.structure !==
    challenge.marketStructure
  ) {
    return false;
  }

  /*
   * ========================================
   * PERFECT COMPETITION
   * ========================================
   *
   * Profit maximization occurs where:
   *
   * P = MR = MC
   */
  if (
    challenge.id ===
    "perfect-competition-profit-max"
  ) {
    const costs = calculateCosts(
      state.firm.production,
      state.firm.fixedCosts,
    );

    const price =
      state.market.averageMarketPrice;

    const difference =
      Math.abs(
        price - costs.marginalCost,
      );

    return difference <= 0.15;
  }

  /*
   * ========================================
   * MONOPOLISTIC COMPETITION
   * ========================================
   *
   * Positive economic profit attracts
   * additional differentiated firms.
   *
   * Completion requires an ACTUAL entry,
   * not merely entry pressure.
   */
  if (
    challenge.id ===
    "monopolistic-entry"
  ) {
    return (
      state.market.firmsEntered > 0
    );
  }

  /*
   * ========================================
   * OLIGOPOLY
   * ========================================
   *
   * The player must gain a relative-price
   * demand advantage without allowing
   * competition to escalate into a price war.
   */
  if (
    challenge.id ===
    "oligopoly-strategy"
  ) {
    const rivalPrice =
      Math.max(
        state.market.rivalPrice,
        0.01,
      );

    const playerPrice =
      Math.max(
        state.firm.price,
        0.01,
      );

    const hasPriceAdvantage =
      playerPrice < rivalPrice;

    const noPriceWar =
      state.market.priceWarPressure < 2;

    return (
      hasPriceAdvantage &&
      noPriceWar
    );
  }

  /*
   * ========================================
   * MONOPOLY
   * ========================================
   *
   * Profit maximization occurs where:
   *
   * MR = MC
   */
  if (
    challenge.id ===
    "monopoly-profit-max"
  ) {
    const quantity =
      state.firm.production;

    const marginalRevenue =
      calculateMarginalRevenue(
        state,
        quantity,
      );

    const costs =
      calculateCosts(
        quantity,
        state.firm.fixedCosts,
      );

    const difference =
      Math.abs(
        marginalRevenue -
          costs.marginalCost,
      );

    return difference <= 0.15;
  }

  return false;
}