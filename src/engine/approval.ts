import type { GameState } from "../models/GameState";

export function updateApproval(
  previous: GameState,
  next: GameState
) {
  const gdpChange = next.gdp - previous.gdp;
  const inflationChange =
    next.inflation - previous.inflation;
  const unemploymentChange =
    next.unemployment - previous.unemployment;

  next.approval += gdpChange * 0.35;

  next.approval -= inflationChange * 4;

  next.approval -= unemploymentChange * 5;

  if (next.incomeTax > 35) {
    next.approval -=
      (next.incomeTax - 35) * 0.25;
  }

  if (
    next.incomeTax >= 15 &&
    next.incomeTax <= 30
  ) {
    next.approval += 0.5;
  }

  if (next.inflation > 6) {
    next.approval -=
      (next.inflation - 6) * 0.75;
  }

  if (next.unemployment > 8) {
    next.approval -=
      (next.unemployment - 8);
  }

  next.approval +=
    (Math.random() - 0.5) * 1.5;
}