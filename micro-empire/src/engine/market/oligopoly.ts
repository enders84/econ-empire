import type { GameState } from "../../models/GameState";

export interface OligopolyResult {
  price: number;
  quantityDemanded: number;
  marginalRevenue: number;
  rivalPrice: number;
  priceGap: number;
  strategicEffect: number;
}

const round = (value: number): number =>
  Math.round(value * 100) / 100;

/*
 * OLIGOPOLY
 *
 * The firm operates in a market with only
 * a few major competitors.
 *
 * Unlike monopolistic competition, demand
 * depends heavily on the firm's price
 * relative to rival firms.
 */
export function runOligopoly(
  state: GameState,
): OligopolyResult {
  const {
    baseDemand,
    averageMarketPrice,
    priceElasticity,
    marketSize,
  } = state.market;

  const firmPrice =
    Math.max(
      state.firm.price,
      0.01,
    );

  /*
   * For the first version of the oligopoly
   * engine, the market's average price acts
   * as the representative rival price.
   *
   * Later we can replace this with actual
   * rival firms that remember and react to
   * the player's decisions.
   */
const rivalPrice =
  Math.max(
    state.market.rivalPrice,
    0.01,
  );

  /*
   * PRICE GAP
   *
   * Positive:
   * our price is above rivals.
   *
   * Negative:
   * our price is below rivals.
   */
  const priceGap =
    firmPrice -
    rivalPrice;

  const relativePrice =
    firmPrice /
    rivalPrice;

  /*
   * STRATEGIC PRICE EFFECT
   *
   * Consumers in an oligopoly can often
   * switch between a small number of major
   * competing firms.
   *
   * Therefore relative price matters.
   */
  const strategicMultiplier =
    Math.pow(
      relativePrice,
      -priceElasticity * 1.25,
    );

  /*
   * STANDARD MARKET PRICE EFFECT
   *
   * This preserves the normal relationship
   * between price and quantity demanded.
   */
  const marketPriceEffect =
    Math.pow(
      firmPrice /
        averageMarketPrice,
      -priceElasticity,
    );

  /*
   * Combine ordinary demand with the
   * additional strategic effect created
   * by rival pricing.
   *
   * The square root prevents us from
   * double-counting the price response too
   * aggressively in this first version.
   */
  const combinedPriceEffect =
    Math.sqrt(
      strategicMultiplier *
        marketPriceEffect,
    );

  const quantityDemanded =
    Math.min(
      marketSize,
      Math.max(
        0,
        baseDemand *
          combinedPriceEffect,
      ),
    );

  /*
   * Report the strategic demand effect
   * relative to matching the rival price.
   *
   * Example:
   *
   * +10% = relative pricing helps demand.
   * -10% = relative pricing hurts demand.
   */
  const strategicEffect =
    (strategicMultiplier - 1) *
    100;

  /*
   * Approximate marginal revenue by making
   * a small change in price and observing
   * the resulting change in revenue and
   * quantity.
   */

  const priceStep = 0.05;

  const lowerPrice =
    Math.max(
      0.01,
      firmPrice - priceStep,
    );

  const upperPrice =
    firmPrice + priceStep;

  const quantityAtPrice = (
    price: number,
  ): number => {
    const relative =
      price / rivalPrice;

    const strategic =
      Math.pow(
        relative,
        -priceElasticity * 1.25,
      );

    const marketEffect =
      Math.pow(
        price /
          averageMarketPrice,
        -priceElasticity,
      );

    const combined =
      Math.sqrt(
        strategic *
          marketEffect,
      );

    return Math.min(
      marketSize,
      Math.max(
        0,
        baseDemand *
          combined,
      ),
    );
  };

  const lowerQuantity =
    quantityAtPrice(
      lowerPrice,
    );

  const upperQuantity =
    quantityAtPrice(
      upperPrice,
    );

  const lowerRevenue =
    lowerPrice *
    lowerQuantity;

  const upperRevenue =
    upperPrice *
    upperQuantity;

  const quantityChange =
    upperQuantity -
    lowerQuantity;

  const marginalRevenue =
    Math.abs(quantityChange) >
    0.0001
      ? (upperRevenue -
          lowerRevenue) /
        quantityChange
      : 0;

  return {
    price:
      round(firmPrice),

    quantityDemanded:
      round(quantityDemanded),

    marginalRevenue:
      round(marginalRevenue),

    rivalPrice:
      round(rivalPrice),

    priceGap:
      round(priceGap),

    strategicEffect:
      round(strategicEffect),
  };
}