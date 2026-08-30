import type { GameState } from "../models/GameState";

import { runFirm } from "./firm/runFirm";

export function advanceQuarter(
  previousState: GameState,
): GameState {
  const stateAfterFirm =
    runFirm(previousState);

  const nextQuarter =
    previousState.quarter >= 4
      ? 1
      : previousState.quarter + 1;

  const nextYear =
    previousState.quarter >= 4
      ? previousState.year + 1
      : previousState.year;

  return {
    ...stateAfterFirm,

    year: nextYear,
    quarter: nextQuarter,
  };
}