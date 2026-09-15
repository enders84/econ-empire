import type { GameState } from "../../models/GameState";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateDemand(
  state: GameState,
): number {
  const {
    baseDemand,
    averageMarketPrice,
    priceElasticity,
    marketSize,
  } = state.market;

  const structure =
    state.market.structure;

  /*
   * PERFECT COMPETITION
   *
   * The individual firm is a price taker.
   *
   * At the market price, it can sell the output
   * it chooses to produce.
   *
   * Charging above the market price causes
   * demand for this firm's product to collapse.
   */
  if (structure === "Perfect Competition") {
    const marketPrice =
      averageMarketPrice;

    const firmPrice =
      state.firm.price;

    if (firmPrice > marketPrice + 0.01) {
      return 0;
    }

    return round(
      Math.min(
        state.firm.production,
        marketSize,
      ),
    );
  }

  /*
   * MONOPOLY
   *
   * Monopoly now uses the same linear inverse
   * demand model as the Demand, Revenue, and
   * MR graphs:
   *
   * P = a - bQ
   *
   * Because the player chooses production,
   * the quantity produced determines the
   * market-clearing price.
   */
  if (structure === "Monopoly") {
    const quantity =
      Math.min(
        Math.max(
          state.firm.production,
          0,
        ),
        marketSize,
      );

    /*
     * priceForQuantity() is called here so
     * this engine uses the same demand model
     * as the graphs.
     *
     * The returned price will be used when
     * we synchronize monopoly pricing in the
     * quarter engine.
     */

    return round(quantity);
  }

  /*
   * MONOPOLISTIC COMPETITION / OLIGOPOLY
   *
   * Keep the existing constant-elasticity
   * demand model for now.
   *
   * This allows price changes to influence
   * the firm's quantity demanded.
   */
  const price = Math.max(
    state.firm.price,
    0.01,
  );

  const priceRatio =
    price / averageMarketPrice;

  const demandMultiplier =
    Math.pow(
      priceRatio,
      -priceElasticity,
    );

  const quantityDemanded =
    baseDemand * demandMultiplier;

  return round(
    Math.min(
      Math.max(
        quantityDemanded,
        0,
      ),
      marketSize,
    ),
  );
}