import type { GameState } from "../../models/GameState";

export interface MonopolisticCompetitionResult {
  price: number;
  quantityDemanded: number;
  marginalRevenue: number;
  brandStrength: number;
  advertisingCost: number;
}

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function runMonopolisticCompetition(
  state: GameState,
): MonopolisticCompetitionResult {
  const {
    baseDemand,
    averageMarketPrice,
    priceElasticity,
    marketSize,
  } = state.market;

  const {
    price,
    advertising,
    brandStrength,
  } = state.firm;

  /*
   * BRAND DEVELOPMENT
   *
   * Advertising strengthens the brand,
   * but brand strength slowly fades when
   * advertising is low.
   *
   * Advertising has diminishing returns.
   */
  const advertisingEffect =
    advertising > 0
      ? Math.log1p(advertising / 1000) * 2
      : 0;

  const brandDecay = 1;

  const newBrandStrength =
    Math.min(
      100,
      Math.max(
        0,
        brandStrength -
          brandDecay +
          advertisingEffect,
      ),
    );

  /*
   * BRAND DEMAND EFFECT
   *
   * Stronger brands attract more consumers.
   *
   * Brand strength of 20 is our baseline.
   */
  const brandDemandMultiplier =
    1 +
    (newBrandStrength - 20) * 0.01;

  /*
   * PRODUCT DIFFERENTIATION
   *
   * Strong brands make consumers somewhat
   * less sensitive to price.
   *
   * We limit the effect so demand never
   * becomes unrealistically insensitive.
   */
  const effectiveElasticity =
    Math.max(
      0.75,
      priceElasticity *
        (1 -
          newBrandStrength * 0.003),
    );

  /*
   * DOWNWARD-SLOPING FIRM DEMAND
   *
   * Unlike perfect competition, the firm
   * has some control over price because
   * its product is differentiated.
   */
  const safePrice =
    Math.max(price, 0.01);

  const priceRatio =
    safePrice /
    averageMarketPrice;

  const demandMultiplier =
    Math.pow(
      priceRatio,
      -effectiveElasticity,
    );

  const quantityDemanded =
    Math.min(
      marketSize,
      Math.max(
        0,
        baseDemand *
          brandDemandMultiplier *
          demandMultiplier,
      ),
    );

  /*
   * Approximate MR numerically.
   *
   * For now this gives the market engine
   * an MR estimate. Later we'll build a
   * dedicated monopolistic-competition
   * MR curve for the graph.
   */
  const revenue =
    safePrice * quantityDemanded;

  const marginalRevenue =
    quantityDemanded > 0
      ? revenue / quantityDemanded
      : 0;

  return {
    price: round(safePrice),

    quantityDemanded:
      round(quantityDemanded),

    marginalRevenue:
      round(marginalRevenue),

    brandStrength:
      round(newBrandStrength),

    advertisingCost:
      round(advertising),
  };
}