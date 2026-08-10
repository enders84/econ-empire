import type { GameState } from "../../models/GameState";
import type { NewsItem } from "../../models/NewsItem";

export function generateEconomicNews(
  previousState: GameState,
  currentState: GameState,
): NewsItem[] {
  const news: NewsItem[] = [];

  const year =
    currentState.politics.currentYear;

  const quarter =
    currentState.quarter;

  const gdpGrowth =
    ((currentState.economy.gdp -
      previousState.economy.gdp) /
      Math.max(previousState.economy.gdp, 1)) *
    100;

  const inflation =
    currentState.economy.inflation;

  const unemployment =
    currentState.economy.unemployment;

  const debtToGdp =
    currentState.treasury.debtToGdp;

  const businessCycle =
    currentState.economy.businessCycle;

  if (
    businessCycle === "Recession" &&
    previousState.economy.businessCycle !==
      "Recession"
  ) {
    news.push({
      year,
      quarter,
      title: "Economy Enters Recession",
      description:
        "Persistent economic weakness, below-capacity output, and elevated unemployment have pushed the economy into recession.",
      category: "BusinessCycle",
    });
  }

  if (
    businessCycle === "Recovery" &&
    previousState.economy.businessCycle !==
      "Recovery"
  ) {
    news.push({
      year,
      quarter,
      title: "Economic Recovery Begins",
      description:
        "Economic growth has returned, although output remains below its full productive capacity.",
      category: "BusinessCycle",
    });
  }

  if (
    businessCycle === "Boom" &&
    previousState.economy.businessCycle !==
      "Boom"
  ) {
    news.push({
      year,
      quarter,
      title: "Economy Surges Into Boom",
      description:
        "Strong growth and high levels of economic activity are increasing the risk of overheating.",
      category: "BusinessCycle",
    });
  }

  if (gdpGrowth >= 1) {
    news.push({
      year,
      quarter,
      title: "Economic Growth Accelerates",
      description: `GDP expanded by ${gdpGrowth.toFixed(
        2,
      )}% this quarter.`,
      category: "Growth",
    });
  }

  if (gdpGrowth <= -1) {
    news.push({
      year,
      quarter,
      title: "Economic Output Contracts",
      description: `GDP declined by ${Math.abs(
        gdpGrowth,
      ).toFixed(2)}% this quarter.`,
      category: "Growth",
    });
  }

  if (inflation >= 5) {
    news.push({
      year,
      quarter,
      title: "Inflation Pressures Intensify",
      description: `Inflation has climbed to ${inflation.toFixed(
        2,
      )}%, increasing pressure on households and policymakers.`,
      category: "Inflation",
    });
  }

  if (unemployment >= 8) {
    news.push({
      year,
      quarter,
      title: "Unemployment Reaches Elevated Levels",
      description: `The unemployment rate has risen to ${unemployment.toFixed(
        2,
      )}%, signaling significant labor-market weakness.`,
      category: "Labor",
    });
  }

  if (debtToGdp >= 120) {
    news.push({
      year,
      quarter,
      title: "National Debt Raises Fiscal Concerns",
      description: `Government debt has reached ${debtToGdp.toFixed(
        1,
      )}% of GDP.`,
      category: "Debt",
    });
  }

  return news;
}