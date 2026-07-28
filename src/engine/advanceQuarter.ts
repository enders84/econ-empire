import type { GameState } from "../models/GameState";
import { runEconomy } from "./economy/economy";
import { calculateInflation } from "./economy/calculateInflation";
import { calculateUnemployment } from "./economy/calculateUnemployment";
import { runTreasury } from "./treasury/treasury";
import { runPolitics } from "./politics/politics";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function advanceQuarter(
  previousState: GameState,
): GameState {
  const economyState = runEconomy(previousState);

  const inflation = calculateInflation(
    previousState,
    economyState,
  );

  const unemployment = calculateUnemployment(
    previousState,
    economyState,
  );

  const stateWithLaborAndPrices: GameState = {
    ...economyState,

    economy: {
      ...economyState.economy,
      inflation: round(inflation),
      unemployment: round(unemployment),
    },
  };

  const treasuryState = runTreasury(
    stateWithLaborAndPrices,
  );

  const politicsState = runPolitics(
    previousState,
    treasuryState,
  );

  const nextQuarter =
    previousState.quarter >= 4
      ? 1
      : previousState.quarter + 1;

  const nextYear =
    previousState.quarter >= 4
      ? previousState.politics.currentYear + 1
      : previousState.politics.currentYear;

  const nextState: GameState = {
    ...politicsState,

    quarter: nextQuarter,

    politics: {
      ...politicsState.politics,
      currentYear: nextYear,
    },

    history: [
      ...previousState.history,
      {
        quarter: previousState.quarter,
        gdp: politicsState.economy.gdp,
        potentialGdp: politicsState.economy.potentialGdp,
        inflation: politicsState.economy.inflation,
        unemployment: politicsState.economy.unemployment,
        debt: politicsState.treasury.debt,
        debtToGdp: politicsState.treasury.debtToGdp,
        budgetBalance: politicsState.treasury.budgetBalance,
        approval: politicsState.politics.approval,
      },
    ],
  };

  return nextState;
}