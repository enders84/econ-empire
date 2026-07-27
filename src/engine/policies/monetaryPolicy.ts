import type { GameState } from "../../models/GameState";

const DEFAULT_INTEREST_RATE = 3;

function safeNumber(
  value: number,
  fallback: number
): number {
  return Number.isFinite(value)
    ? value
    : fallback;
}

export function applyMonetaryPolicy(
  state: GameState
): GameState {
  const interestRate = safeNumber(
    state.interestRate,
    DEFAULT_INTEREST_RATE
  );

  const inflation = safeNumber(
    state.inflation,
    2
  );

  const unemployment = safeNumber(
    state.unemployment,
    5
  );

  /*
   * Higher interest rates generally reduce inflation
   * but can increase unemployment slightly.
   *
   * Lower interest rates stimulate employment but may
   * allow inflation to rise.
   */

  const inflationAdjustment =
    (interestRate - DEFAULT_INTEREST_RATE) *
    -0.05;

  const unemploymentAdjustment =
    (interestRate - DEFAULT_INTEREST_RATE) *
    0.02;

  return {
    ...state,

    inflation: Math.max(
      -2,
      inflation + inflationAdjustment
    ),

    unemployment: Math.max(
      2,
      unemployment +
        unemploymentAdjustment
    ),
  };
}