import type { GameState } from "../models/GameState";
import { runEconomy } from "./economy/economy";
import { calculateInflation } from "./economy/calculateInflation";
import { calculateUnemployment } from "./economy/calculateUnemployment";
import { applyEvent } from "./events/applyEvent";
import { selectRandomEvent } from "./events/selectRandomEvent";
import { runPolitics } from "./politics/politics";
import { runTreasury } from "./treasury/treasury";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

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

  // Calculate GDP, potential GDP, productivity,
  // output gap, and GDP components.
  const economyState = runEconomy(previousState);

  // Calculate inflation and unemployment from
  // the newly updated economic conditions.
  const inflation = calculateInflation(
    previousState,
    economyState,
  );

  const unemployment = calculateUnemployment(
    previousState,
    economyState,
  );
  console.log("Output gap:", economyState.economy.outputGap);
console.log(
  "Policy interest rate:",
  economyState.policy.policyInterestRate,
);
console.log(
  "Inflation:",
  previousState.economy.inflation,
  "→",
  inflation,
);
console.log(
  "Unemployment:",
  previousState.economy.unemployment,
  "→",
  unemployment,
);
  const stateWithLaborAndPrices: GameState = {
    ...economyState,

    economy: {
      ...economyState.economy,
      inflation: round(inflation),
      unemployment: round(unemployment),
      interestRate:
        economyState.policy.policyInterestRate,
    },
  };

  const treasuryState = runTreasury(
    stateWithLaborAndPrices,
  );

  const politicsState = runPolitics(
    previousState,
    treasuryState,
  );

  const selectedEvent = selectRandomEvent();

  const stateAfterEvent =
    selectedEvent !== null
      ? applyEvent(politicsState, selectedEvent)
      : politicsState;

  const updatedState: GameState = {
    ...stateAfterEvent,

    quarter: nextQuarter,

    politics: {
      ...stateAfterEvent.politics,
      currentYear: nextYear,
    },

    history: [
      ...previousState.history,
      {
        year: nextYear,
        quarter: nextQuarter,

        gdp: stateAfterEvent.economy.gdp,
        inflation: stateAfterEvent.economy.inflation,
        unemployment:
          stateAfterEvent.economy.unemployment,

        debt: stateAfterEvent.treasury.debt,
        debtToGdp:
          stateAfterEvent.treasury.debtToGdp,

        approval:
          stateAfterEvent.politics.approval,
      },
    ],
  };

  return updatedState;
}