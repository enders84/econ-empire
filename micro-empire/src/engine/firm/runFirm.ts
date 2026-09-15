import type { GameState } from "../../models/GameState";

import { calculateCosts } from "./calculateCosts";
import { runMarket } from "../market/runMarket";
import { runMonopolisticCompetition } from "../market/monopolisticCompetition";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function runFirm(
  state: GameState,
): GameState {
  /*
   * Run the appropriate market structure.
   */
  const marketResult =
    runMarket(state);

  const quantityDemanded =
    marketResult.quantityDemanded;

  const effectivePrice =
    marketResult.price;

  /*
   * Production cannot be negative.
   */
  const production =
    Math.max(
      state.firm.production,
      0,
    );

  /*
   * The firm cannot sell more than consumers
   * demand or more than it produced.
   */
  const unitsSold =
    Math.min(
      quantityDemanded,
      production,
    );

  /*
   * TOTAL REVENUE
   *
   * TR = P × Q sold
   */
  const revenue =
    effectivePrice * unitsSold;

  /*
   * PRODUCTION COSTS
   */
  const costs =
    calculateCosts(
      production,
      state.firm.fixedCosts,
    );

  const productionCosts =
    costs.totalCosts;

  /*
   * MONOPOLISTIC COMPETITION
   *
   * Advertising is an additional business
   * expense and also affects brand strength.
   */
  let advertisingCost = 0;

  let updatedBrandStrength =
    state.firm.brandStrength;

  if (
    state.market.structure ===
    "Monopolistic Competition"
  ) {
    const result =
      runMonopolisticCompetition(
        state,
      );

    advertisingCost =
      result.advertisingCost;

    updatedBrandStrength =
      result.brandStrength;
  }

  /*
   * TOTAL COST
   *
   * Production costs + advertising.
   */
  const totalCosts =
    productionCosts +
    advertisingCost;

  /*
   * ECONOMIC PROFIT
   *
   * Profit = TR - TC
   */
  const profit =
    revenue - totalCosts;

  /*
   * MARKET SHARE
   *
   * Temporary calculation until we add
   * actual competitor firms.
   */
  const marketShare =
    state.market.marketSize > 0
      ? (unitsSold /
          state.market.marketSize) *
        100
      : 0;

  /*
   * Return the updated game state.
   */
  return {
    ...state,

    cash: round(
      state.cash + profit,
    ),

    firm: {
      ...state.firm,

      price:
        round(effectivePrice),

      brandStrength:
        round(
          updatedBrandStrength,
        ),

      unitsSold:
        round(unitsSold),

      revenue:
        round(revenue),

      totalCosts:
        round(totalCosts),

      profit:
        round(profit),

      marketShare:
        round(marketShare),
    },
  };
}