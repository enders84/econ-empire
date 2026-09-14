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

const BASELINE_FIRMS = 10;

/*
 * ========================================
 * BRAND EFFECT
 * ========================================
 *
 * Brand Strength 20 = baseline.
 *
 * Stronger brands shift the individual
 * firm's demand curve outward.
 */
export function getMonopolisticBrandMultiplier(
  brandStrength: number,
): number {
  return Math.max(
    0.2,
    1 +
      (brandStrength - 20) *
        0.01,
  );
}

/*
 * ========================================
 * COMPETITION EFFECT
 * ========================================
 *
 * 10 firms = baseline.
 *
 * Entry shifts the individual firm's
 * demand inward.
 *
 * Exit shifts its demand outward.
 */
export function getMonopolisticCompetitionMultiplier(
  state: GameState,
): number {
  const competitorDifference =
    state.market.numberOfFirms -
    BASELINE_FIRMS;

  return Math.max(
    0.4,
    Math.min(
      1.6,
      1 -
        competitorDifference *
          0.05,
    ),
  );
}

/*
 * ========================================
 * DEMAND INTERCEPT
 * ========================================
 *
 * We build a linear inverse demand curve:
 *
 * P = a - bQ
 *
 * averageMarketPrice is the price at the
 * firm's adjusted baseline quantity.
 *
 * priceElasticity controls the slope.
 *
 * Brand strength and competition change
 * the quantity consumers want from this
 * particular differentiated firm.
 */
function getDemandParameters(
  state: GameState,
  brandStrength: number,
): {
  intercept: number;
  slope: number;
  adjustedDemand: number;
} {
  const {
    baseDemand,
    averageMarketPrice,
    priceElasticity,
  } = state.market;

  const brandMultiplier =
    getMonopolisticBrandMultiplier(
      brandStrength,
    );

  const competitionMultiplier =
    getMonopolisticCompetitionMultiplier(
      state,
    );

  const adjustedDemand =
    Math.max(
      1,
      baseDemand *
        brandMultiplier *
        competitionMultiplier,
    );

  /*
   * For linear demand, point elasticity is:
   *
   * E = (P / Q) × (1 / b)
   *
   * Solving for b at our baseline point:
   *
   * b = P / (E × Q)
   */
  const safeElasticity =
    Math.max(
      0.25,
      priceElasticity,
    );

  const slope =
    averageMarketPrice /
    (safeElasticity *
      adjustedDemand);

  /*
   * Since:
   *
   * P = a - bQ
   *
   * and the curve passes through:
   *
   * Q = adjustedDemand
   * P = averageMarketPrice
   *
   * then:
   *
   * a = P + bQ
   */
  const intercept =
    averageMarketPrice +
    slope * adjustedDemand;

  return {
    intercept,
    slope,
    adjustedDemand,
  };
}

/*
 * ========================================
 * PRICE FROM QUANTITY
 * ========================================
 *
 * Inverse firm demand:
 *
 * P = a - bQ
 */
export function priceForMonopolisticQuantity(
  state: GameState,
  quantity: number,
  brandStrength =
    state.firm.brandStrength,
): number {
  const {
    intercept,
    slope,
  } = getDemandParameters(
    state,
    brandStrength,
  );

  const safeQuantity =
    Math.max(quantity, 0);

  return Math.max(
    0,
    intercept -
      slope * safeQuantity,
  );
}

/*
 * ========================================
 * QUANTITY FROM PRICE
 * ========================================
 *
 * Rearranging:
 *
 * P = a - bQ
 *
 * gives:
 *
 * Q = (a - P) / b
 */
export function quantityForMonopolisticPrice(
  state: GameState,
  price: number,
  brandStrength =
    state.firm.brandStrength,
): number {
  const {
    intercept,
    slope,
  } = getDemandParameters(
    state,
    brandStrength,
  );

  const safePrice =
    Math.max(price, 0);

  const quantity =
    slope > 0
      ? (intercept -
          safePrice) /
        slope
      : 0;

  return Math.min(
    state.market.marketSize,
    Math.max(
      0,
      quantity,
    ),
  );
}

/*
 * ========================================
 * MARGINAL REVENUE
 * ========================================
 *
 * Demand:
 *
 * P = a - bQ
 *
 * Total Revenue:
 *
 * TR = aQ - bQ²
 *
 * Therefore:
 *
 * MR = a - 2bQ
 */
export function marginalRevenueForMonopolisticQuantity(
  state: GameState,
  quantity: number,
  brandStrength =
    state.firm.brandStrength,
): number {
  const {
    intercept,
    slope,
  } = getDemandParameters(
    state,
    brandStrength,
  );

  return (
    intercept -
    2 * slope * quantity
  );
}

/*
 * ========================================
 * TOTAL REVENUE
 * ========================================
 */
export function totalRevenueForMonopolisticQuantity(
  state: GameState,
  quantity: number,
  brandStrength =
    state.firm.brandStrength,
): number {
  const price =
    priceForMonopolisticQuantity(
      state,
      quantity,
      brandStrength,
    );

  return price * quantity;
}

/*
 * ========================================
 * BRAND DEVELOPMENT
 * ========================================
 */
export function calculateNextBrandStrength(
  advertising: number,
  currentBrandStrength: number,
): number {
  const advertisingEffect =
    advertising > 0
      ? Math.log1p(
          advertising / 1000,
        ) * 2
      : 0;

  const brandDecay = 1;

  return Math.min(
    100,
    Math.max(
      0,
      currentBrandStrength -
        brandDecay +
        advertisingEffect,
    ),
  );
}

/*
 * ========================================
 * RUN MARKET STRUCTURE
 * ========================================
 */
export function runMonopolisticCompetition(
  state: GameState,
): MonopolisticCompetitionResult {
  const {
    price,
    advertising,
    brandStrength,
  } = state.firm;

  const newBrandStrength =
    calculateNextBrandStrength(
      advertising,
      brandStrength,
    );

  const quantityDemanded =
    quantityForMonopolisticPrice(
      state,
      price,
      newBrandStrength,
    );

  const marginalRevenue =
    marginalRevenueForMonopolisticQuantity(
      state,
      quantityDemanded,
      newBrandStrength,
    );

  return {
    price:
      round(
        Math.max(price, 0.01),
      ),

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