import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

export function calculateApproval(
  previousState: GameState,
  updatedState: GameState,
): number {
  const previousGDP = Math.max(
    previousState.economy.gdp,
    1,
  );

  const gdpGrowth =
    ((updatedState.economy.gdp - previousGDP) /
      previousGDP) *
    100;

  const growthEffect = gdpGrowth * 0.18;

  const unemploymentPenalty =
    Math.max(
      0,
      updatedState.economy.unemployment - 4,
    ) * 0.35;

  const inflationPenalty =
    Math.max(
      0,
      Math.abs(updatedState.economy.inflation - 2),
    ) * 0.25;

  const taxPenalty =
    Math.max(
      0,
      updatedState.treasury.incomeTax - 30,
    ) * 0.08;

  const deficitPenalty =
    updatedState.treasury.budgetBalance < 0
      ? Math.min(
          2,
          Math.abs(
            updatedState.treasury.budgetBalance,
          ) /
            Math.max(updatedState.economy.gdp, 1),
        )
      : 0;

  const approvalChange =
    growthEffect -
    unemploymentPenalty -
    inflationPenalty -
    taxPenalty -
    deficitPenalty;

  return clamp(
    previousState.politics.approval +
      approvalChange,
    0,
    100,
  );
}