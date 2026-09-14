import type { GameState } from "../models/GameState";

import { runFirm } from "./firm/runFirm";
import { calculateEntryExit } from "./market/calculateEntryExit";
import { calculateRivalReaction } from "./market/calculateRivalReaction";
import { challenges } from "../data/challenges";
import { evaluateChallenge } from "./challenges/challengeEvaluator";
export function advanceQuarter(
  previousState: GameState,
): GameState {
  /*
   * ========================================
   * STEP 1 — RUN THE FIRM
   * ========================================
   *
   * The player's current decisions are
   * processed first.
   *
   * This calculates:
   * - demand
   * - units sold
   * - revenue
   * - costs
   * - profit
   * - cash
   */
  const stateAfterFirm =
    runFirm(previousState);

  /*
   * ========================================
   * STEP 2 — ENTRY / EXIT
   * ========================================
   *
   * This mainly affects Monopolistic
   * Competition.
   *
   * Economic profit creates entry pressure.
   * Economic losses create exit pressure.
   */
  const entryExitResult =
    calculateEntryExit(
      stateAfterFirm,
    );

  let stateAfterMarketResponse: GameState = {
    ...stateAfterFirm,

    market: {
      ...stateAfterFirm.market,

      numberOfFirms:
        entryExitResult.numberOfFirms,

      entryExitPressure:
        entryExitResult.entryExitPressure,
        firmsEntered:
        entryExitResult.firmsEntered,

        firmsExited:
        entryExitResult.firmsExited,
    },
  };

  /*
   * ========================================
   * STEP 3 — OLIGOPOLY RIVAL REACTION
   * ========================================
   *
   * Only run this system when the player
   * is currently operating in Oligopoly.
   *
   * Rivals observe the player's price AFTER
   * this quarter has been calculated.
   *
   * Their new price therefore affects the
   * NEXT quarter.
   */
  if (
    stateAfterFirm.market.structure ===
    "Oligopoly"
  ) {
    const rivalReaction =
      calculateRivalReaction(
        stateAfterMarketResponse,
      );

    stateAfterMarketResponse = {
      ...stateAfterMarketResponse,

      market: {
        ...stateAfterMarketResponse.market,

        rivalPrice:
          rivalReaction.rivalPrice,

        previousRivalPrice:
          rivalReaction.previousRivalPrice,

        priceWarPressure:
          rivalReaction.priceWarPressure,

        rivalReaction:
          rivalReaction.reaction,
      },
    };
  }

  /*
   * ========================================
   * STEP 4 — ADVANCE THE CALENDAR
   * ========================================
   */

  const nextQuarter =
    previousState.quarter >= 4
      ? 1
      : previousState.quarter + 1;

  const nextYear =
    previousState.quarter >= 4
      ? previousState.year + 1
      : previousState.year;

  /*
   * ========================================
   * STEP 5 — RETURN NEXT QUARTER
   * ========================================
   */

 /*
 * ========================================
 * STEP 5 — EVALUATE ACTIVE CHALLENGE
 * ========================================
 */

let updatedChallengeState =
  stateAfterMarketResponse.challenges;

const activeChallengeId =
  updatedChallengeState.activeChallengeId;

if (activeChallengeId) {
  const activeChallenge =
    challenges.find(
      (challenge) =>
        challenge.id ===
        activeChallengeId,
    );

  if (
    activeChallenge &&
    evaluateChallenge(
      activeChallenge,
      stateAfterMarketResponse,
    )
  ) {
    updatedChallengeState = {
      activeChallengeId: null,

      completedChallengeIds:
  updatedChallengeState
    .completedChallengeIds
    .includes(activeChallenge.id)
    ? updatedChallengeState
        .completedChallengeIds
    : [
        ...updatedChallengeState
          .completedChallengeIds,
        activeChallenge.id,
      ],
    };
  }
}

/*
 * ========================================
 * STEP 6 — RETURN NEXT QUARTER
 * ========================================
 */

return {
  ...stateAfterMarketResponse,

  challenges:
    updatedChallengeState,

  year: nextYear,
  quarter: nextQuarter,
};
}