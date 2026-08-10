import type { GameState } from "../models/GameState";

import { runEconomy } from "./economy/economy";
import { calculateInflation } from "./economy/calculateInflation";
import { calculateUnemployment } from "./economy/calculateUnemployment";
import { calculateBusinessCycle } from "./economy/calculateBusinessCycle";
import { generateEconomicNews } from "./news/generateEconomicNews";
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

  // 1. Update GDP, potential GDP, productivity,
  // output gap, and GDP components.
  const economyState = runEconomy(
    previousState,
  );

  // 2. Update inflation and unemployment.
  const inflation = calculateInflation(
    previousState,
    economyState,
  );

  const unemployment =
    calculateUnemployment(
      previousState,
      economyState,
    );

  const stateWithLaborAndPrices: GameState = {
    ...economyState,

    economy: {
      ...economyState.economy,

      inflation: round(inflation),

      unemployment:
        round(unemployment),

      interestRate:
        economyState.policy.policyInterestRate,
    },
  };

  // 3. Update government finances.
  const treasuryState = runTreasury(
    stateWithLaborAndPrices,
  );

  // 4. Update public approval.
  const politicsState = runPolitics(
    previousState,
    treasuryState,
  );

  // 5. Determine and apply a random event.
  const selectedEvent =
    selectRandomEvent();

  const stateAfterEvent =
    selectedEvent !== null
      ? applyEvent(
          politicsState,
          selectedEvent,
        )
      : politicsState;

  // 6. Determine the business cycle using
  // the final economic conditions.
  const businessCycle =
    calculateBusinessCycle(
      previousState,
      stateAfterEvent,
    );

  // 7. Calculate GDP growth after events.
  const previousGdp = Math.max(
    previousState.economy.gdp,
    1,
  );

  const gdpGrowth =
    ((stateAfterEvent.economy.gdp -
      previousGdp) /
      previousGdp) *
    100;

  // 8. Save the completed quarter.
  // 8. Build the completed quarter before news.
const stateBeforeNews: GameState = {
  ...stateAfterEvent,

  quarter: nextQuarter,

  currentEventTitle:
    selectedEvent?.title,

  currentEventDescription:
    selectedEvent?.description,

  economy: {
    ...stateAfterEvent.economy,
    businessCycle,
  },

  politics: {
    ...stateAfterEvent.politics,
    currentYear: nextYear,
  },

  history: [
    ...previousState.history,

    {
      year: nextYear,
      quarter: nextQuarter,

      gdp:
        stateAfterEvent.economy.gdp,

      gdpGrowth:
        round(gdpGrowth),

      potentialGdp:
        stateAfterEvent.economy.potentialGdp,

      outputGap:
        stateAfterEvent.economy.outputGap,

      inflation:
        stateAfterEvent.economy.inflation,

      unemployment:
        stateAfterEvent.economy.unemployment,

      debt:
        stateAfterEvent.treasury.debt,

      debtToGdp:
        stateAfterEvent.treasury.debtToGdp,

      approval:
        stateAfterEvent.politics.approval,
    },
  ],

  news: previousState.news,
};

// 9. Generate economic headlines from the
// completed quarter.
const generatedNews = generateEconomicNews(
  previousState,
  stateBeforeNews,
);

const eventNews =
  selectedEvent !== null
    ? [
        {
          year: nextYear,
          quarter: nextQuarter,
          title: selectedEvent.title,
          description:
            selectedEvent.description,
          category: "Event" as const,
        },
      ]
    : [];

// 10. Save all news for the quarter.
const updatedState: GameState = {
  ...stateBeforeNews,

  news: [
    ...previousState.news,
    ...eventNews,
    ...generatedNews,
  ],
};

return updatedState;
}