import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number =>
  Math.min(Math.max(value, minimum), maximum);

export function runElection(
  state: GameState,
): GameState {
  const {
    approval,
    currentYear,
    electionYear,
  } = state.politics;

  const isElectionQuarter =
    currentYear === electionYear &&
    state.quarter === 4;

  if (!isElectionQuarter) {
    return state;
  }

  const latestHistory =
    state.history[state.history.length - 1];

  const growth =
    latestHistory?.gdpGrowth ?? 0;

  const unemployment =
    state.economy.unemployment;

  const inflation =
    state.economy.inflation;

  let electionScore = approval;

  // Economic performance matters,
  // but approval remains the main driver.
  electionScore += growth * 1.5;

  electionScore -=
    Math.max(0, unemployment - 5) * 0.75;

  electionScore -=
    Math.max(0, Math.abs(inflation - 2) - 1) *
    0.75;

  // Small incumbency advantage.
  electionScore += 3;

  electionScore = clamp(
    electionScore,
    0,
    100,
  );

  const result =
    electionScore >= 48
      ? "Won"
      : "Lost";

  return {
    ...state,

    politics: {
      ...state.politics,

      lastElectionYear:
        currentYear,

      lastElectionResult:
        result,

      electionYear:
        currentYear + 4,
    },
  };
}