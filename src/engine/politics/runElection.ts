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

  const growth =
    state.history.length > 0
      ? state.history[state.history.length - 1]
          .gdpGrowth
      : 0;

  const unemployment =
    state.economy.unemployment;

  const inflation =
    state.economy.inflation;

  let electionScore = approval;

  electionScore += growth * 3;

  electionScore -=
    Math.max(0, unemployment - 5) * 2;

  electionScore -=
    Math.abs(inflation - 2) * 1.5;

  electionScore = clamp(
    electionScore,
    0,
    100,
  );

  const result =
    electionScore >= 50
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