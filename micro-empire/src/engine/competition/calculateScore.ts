import type { GameState } from "../../models/GameState";

export function calculateScore(
  state: GameState,
): number {
  const profitScore =
    Math.max(
      0,
      state.firm.profit / 100,
    );

  const marketShareScore =
    state.firm.marketShare * 10;

  const challengeScore =
    state.challenges
      .completedChallengeIds.length *
    1000;

  const cashScore =
    Math.max(
      0,
      state.cash / 1000,
    );

  let penalty = 0;

  if (
    state.market.structure ===
      "Oligopoly" &&
    state.market.priceWarPressure >= 2
  ) {
    penalty += 500;
  }

  if (state.cash < 0) {
    penalty += 2000;
  }

  const totalScore =
    profitScore +
    marketShareScore +
    challengeScore +
    cashScore -
    penalty;

  return Math.max(
    0,
    Math.round(totalScore),
  );
}