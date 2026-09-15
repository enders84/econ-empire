import type { GameState } from "../../models/GameState";

/*
 * Linear inverse demand:
 *
 * P = a - bQ
 *
 * We anchor the demand curve so that the
 * market's base demand occurs at the
 * average market price.
 */
export function priceForQuantity(
  state: GameState,
  quantity: number,
): number {
  const {
    baseDemand,
    averageMarketPrice,
  } = state.market;

  /*
   * Choose a choke price equal to twice
   * the normal market price.
   *
   * This gives us:
   *
   * Q = baseDemand
   * P = averageMarketPrice
   */
  const chokePrice =
    averageMarketPrice * 2;

  const slope =
    (chokePrice -
      averageMarketPrice) /
    Math.max(baseDemand, 1);

  const price =
    chokePrice -
    slope * quantity;

  return Math.max(0, price);
}

/*
 * With linear inverse demand:
 *
 * Demand: P = a - bQ
 * MR:     MR = a - 2bQ
 */
export function calculateMarginalRevenue(
  state: GameState,
  quantity: number,
): number {
  const {
    baseDemand,
    averageMarketPrice,
  } = state.market;

  const chokePrice =
    averageMarketPrice * 2;

  const slope =
    (chokePrice -
      averageMarketPrice) /
    Math.max(baseDemand, 1);

  const marginalRevenue =
    chokePrice -
    2 * slope * quantity;

  return (
    Math.round(
      marginalRevenue * 100,
    ) / 100
  );
}