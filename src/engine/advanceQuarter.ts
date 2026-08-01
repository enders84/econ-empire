import type { GameState } from "../models/GameState";
import { runEconomy } from "./economy/economy";
import { applyEvent } from "./events/applyEvent";
import { selectRandomEvent } from "./events/selectRandomEvent";
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