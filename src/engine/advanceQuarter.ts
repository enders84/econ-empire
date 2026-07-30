import type { GameState } from "../models/GameState";
import { runEconomy } from "./economy/economy";
import { runPolitics } from "./politics/politics";
import { runTreasury } from "./treasury/treasury";

export function advanceQuarter(
  previousState: GameState,
): GameState {
  const nextQuarter =
    previousState.quarter >= 4
      ? 1
      : previousState.quarter + 1;

  const nextYear =
    previousState.quarter >= 4
      ? previousState.politics.currentYear + 1
      : previousState.politics.currentYear;

  const economyState = runEconomy(previousState);

  const treasuryState = runTreasury(economyState);

  const politicsState = runPolitics(
    previousState,
    treasuryState,
  );

  const updatedState: GameState = {
    ...politicsState,

    quarter: nextQuarter,

    politics: {
      ...politicsState.politics,
      currentYear: nextYear,
    },

    history: [
      ...previousState.history,
      {
        year: nextYear,
        quarter: nextQuarter,

        gdp: politicsState.economy.gdp,
        inflation: politicsState.economy.inflation,
        unemployment:
          politicsState.economy.unemployment,

        debt: politicsState.treasury.debt,
        debtToGdp:
          politicsState.treasury.debtToGdp,

        approval:
          politicsState.politics.approval,
      },
    ],
  };

  return updatedState;
}