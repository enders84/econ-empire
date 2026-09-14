import type { GameState } from "../../models/GameState";

export interface RivalReactionResult {
  rivalPrice: number;
  previousRivalPrice: number;
  priceWarPressure: number;
  reaction:
    | "Stable"
    | "Partial Match"
    | "Aggressive Match"
    | "Price War"
    | "Rival Price Increase";
}

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateRivalReaction(
  state: GameState,
): RivalReactionResult {
  const playerPrice =
    Math.max(
      state.firm.price,
      0.01,
    );

  const currentRivalPrice =
    Math.max(
      state.market.rivalPrice,
      0.01,
    );

  const previousRivalPrice =
    currentRivalPrice;

  let priceWarPressure =
    state.market.priceWarPressure;

  let newRivalPrice =
    currentRivalPrice;

  let reaction:
    RivalReactionResult["reaction"] =
      "Stable";

  /*
   * PRICE DIFFERENCE
   *
   * Positive:
   * Player is cheaper than rivals.
   *
   * Negative:
   * Player is more expensive.
   */
  const priceAdvantage =
    currentRivalPrice -
    playerPrice;

  const percentageDifference =
    priceAdvantage /
    currentRivalPrice;

  /*
   * ========================================
   * PLAYER UNDERCUTS RIVALS
   * ========================================
   */

  if (percentageDifference >= 0.2) {
    /*
     * Major undercut:
     *
     * Example:
     * rivals = $5
     * player = $4 or less
     *
     * Rivals respond aggressively.
     */
    priceWarPressure += 1;

    newRivalPrice =
      currentRivalPrice -
      priceAdvantage * 0.75;

    reaction =
      "Aggressive Match";
  } else if (
    percentageDifference >= 0.05
  ) {
    /*
     * Moderate undercut.
     *
     * Rivals partially match the player's
     * price reduction.
     */
    priceWarPressure += 0.5;

    newRivalPrice =
      currentRivalPrice -
      priceAdvantage * 0.5;

    reaction =
      "Partial Match";
  }

  /*
   * ========================================
   * PRICE WAR
   * ========================================
   *
   * Repeated aggressive competition causes
   * rivals to become increasingly willing
   * to cut prices.
   */

  if (priceWarPressure >= 2) {
    const additionalCut =
      currentRivalPrice * 0.05;

    newRivalPrice -=
      additionalCut;

    reaction =
      "Price War";
  }

  /*
   * ========================================
   * PLAYER PRICE ABOVE RIVALS
   * ========================================
   *
   * If the player is charging substantially
   * more, rivals have little reason to cut.
   *
   * Price-war pressure begins to dissipate.
   */

  if (percentageDifference <= -0.1) {
    priceWarPressure -= 0.5;

    /*
     * Rivals may cautiously raise price
     * when the player leaves room above
     * the existing rival price.
     *
     * They only move part of the distance.
     */
    const upwardGap =
      playerPrice -
      currentRivalPrice;

    newRivalPrice =
      currentRivalPrice +
      upwardGap * 0.15;

    reaction =
      "Rival Price Increase";
  }

  /*
   * ========================================
   * STABLE PRICING
   * ========================================
   *
   * When prices are close, price-war
   * pressure gradually disappears.
   */

 if (
  Math.abs(
    percentageDifference,
  ) < 0.05
) {
  priceWarPressure -= 0.25;

  /*
   * Prices may currently be close, but if
   * an active price war already caused a
   * rival price cut this quarter, do not
   * overwrite that reaction with "Stable".
   */
  if (reaction !== "Price War") {
    reaction = "Stable";
  }
}

  /*
   * Keep price-war pressure between
   * 0 and 5.
   */
  priceWarPressure =
    Math.max(
      0,
      Math.min(
        5,
        priceWarPressure,
      ),
    );

  /*
   * Prevent unrealistic rival prices.
   *
   * For now rivals cannot price below $1
   * or above $15.
   */
  newRivalPrice =
    Math.max(
      1,
      Math.min(
        15,
        newRivalPrice,
      ),
    );

  return {
    rivalPrice:
      round(newRivalPrice),

    previousRivalPrice:
      round(previousRivalPrice),

    priceWarPressure:
      round(priceWarPressure),

    reaction,
  };
}