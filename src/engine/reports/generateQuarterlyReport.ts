import type { GameState } from "../../models/GameState";
import type { QuarterlyReport } from "../../models/QuarterlyReport";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function generateQuarterlyReport(
  previous: GameState,
  current: GameState,
): QuarterlyReport {
  const summary: string[] = [];

  const gdpChange =
    ((current.economy.gdp - previous.economy.gdp) /
      Math.max(previous.economy.gdp, 1)) *
    100;

  const inflationChange =
    current.economy.inflation -
    previous.economy.inflation;

  const unemploymentChange =
    current.economy.unemployment -
    previous.economy.unemployment;

  const approvalChange =
    current.politics.approval -
    previous.politics.approval;

  if (Math.abs(gdpChange) < 0.10) {
  if (gdpChange > 0) {
    summary.push(
      `GDP was nearly unchanged this quarter, increasing by ${round(
        gdpChange,
      )}%.`,
    );
  } else if (gdpChange < 0) {
    summary.push(
      `GDP was nearly unchanged this quarter, declining by ${round(
        Math.abs(gdpChange),
      )}%.`,
    );
  } else {
    summary.push(
      "GDP was unchanged this quarter.",
    );
  }
} else if (gdpChange > 0) {
  summary.push(
    `GDP grew by ${round(gdpChange)}%.`,
  );
} else {
  summary.push(
    `GDP declined by ${round(
      Math.abs(gdpChange),
    )}%.`,
  );
}

  if (inflationChange > 0) {
    summary.push("Inflation increased.");
  } else if (inflationChange < 0) {
    summary.push("Inflation decreased.");
  }

  if (unemploymentChange > 0) {
    summary.push("Unemployment increased.");
  } else if (unemploymentChange < 0) {
    summary.push("Unemployment declined.");
  }

  switch (current.economy.businessCycle) {
    case "Expansion":
      summary.push(
        "The economy is in an expansion, with sustained growth and relatively healthy labor-market conditions.",
      );
      break;

    case "Boom":
      summary.push(
        "The economy is experiencing a boom, with strong growth but increasing risk of inflation or overheating.",
      );
      break;

    case "Slowdown":
      summary.push(
        "The economy is slowing as growth weakens and economic activity moves closer to or below its productive capacity.",
      );
      break;

    case "Recession":
      summary.push(
        "The economy is in recession, with persistent economic weakness, a negative output gap, and elevated unemployment.",
      );
      break;

    case "Recovery":
      summary.push(
        "The economy is recovering as growth returns, although output remains below its full productive capacity.",
      );
      break;
  }

  return {
    year: current.politics.currentYear,
    quarter: current.quarter,

    gdpChange: round(gdpChange),
    inflationChange: round(inflationChange),
    unemploymentChange: round(
      unemploymentChange,
    ),
    approvalChange: round(approvalChange),

    budgetBalance:
      current.treasury.budgetBalance,

    debtToGdp:
      current.treasury.debtToGdp,

    businessCycle:
      current.economy.businessCycle,

     eventTitle:
    current.currentEventTitle,

    eventDescription:
    current.currentEventDescription,

    summary,
  };
}