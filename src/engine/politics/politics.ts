import type { GameState } from "../../models/GameState";
import { calculateApproval } from "./calculateApproval";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function runPolitics(
  previousState: GameState,
  updatedState: GameState,
): GameState {
  const approval = calculateApproval(
    previousState,
    updatedState,
  );

  return {
    ...updatedState,

    politics: {
      ...updatedState.politics,
      approval: round(approval),
    },
  };
}