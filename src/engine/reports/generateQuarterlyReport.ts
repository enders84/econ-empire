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

  if (gdpChange > 0) {
    summary.push(
      `GDP grew by ${round(gdpChange)}%.`,
    );
  } else {
    summary.push(
      `GDP declined by ${round(Math.abs(gdpChange))}%.`,
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

  return {
    year: current.politics.currentYear,
    quarter: current.quarter,

    gdpChange: round(gdpChange),
    inflationChange: round(inflationChange),
    unemploymentChange: round(unemploymentChange),
    approvalChange: round(approvalChange),

    budgetBalance:
      current.treasury.budgetBalance,

    debtToGdp:
      current.treasury.debtToGdp,

    summary,
  };
}