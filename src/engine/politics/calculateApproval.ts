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
  const previousApproval =
    previousState.politics.approval;

  const previousGDP = Math.max(
    previousState.economy.gdp,
    1,
  );

  const gdpGrowth =
    ((updatedState.economy.gdp - previousGDP) /
      previousGDP) *
    100;

  const unemployment =
    updatedState.economy.unemployment;

  const inflation =
    updatedState.economy.inflation;

  const incomeTax =
    updatedState.policy.incomeTaxRate;

  const deficitShare =
    Math.abs(
      Math.min(
        0,
        updatedState.treasury.budgetBalance,
      ),
    ) /
    Math.max(updatedState.economy.gdp, 1);

  /*
   * Start from a neutral approval level.
   */
  const neutralApproval = 50;

  /*
   * Economic growth improves public sentiment.
   * Recessions reduce it.
   */
  const growthEffect =
    gdpGrowth * 2.0;

  /*
   * 5% unemployment is treated as normal.
   * Only unemployment above that level
   * creates a meaningful penalty.
   */
  const unemploymentPenalty =
    Math.max(0, unemployment - 5) * 2.0;

  /*
   * Inflation around 2% is neutral.
   */
  const inflationPenalty =
    Math.abs(inflation - 2) * 1.5;

  /*
   * Taxes above 30% create some political pressure.
   */
  const taxPenalty =
    Math.max(0, incomeTax - 30) * 0.3;

  /*
   * Large deficits hurt approval, but modest
   * deficits should not dominate politics.
   */
  const deficitPenalty =
    deficitShare * 20;

  const targetApproval =
    neutralApproval +
    growthEffect -
    unemploymentPenalty -
    inflationPenalty -
    taxPenalty -
    deficitPenalty;

  /*
   * Approval moves gradually toward the target
   * instead of accumulating penalties forever.
   */
  const adjustmentSpeed = 0.15;

  const approval =
    previousApproval +
    (targetApproval - previousApproval) *
      adjustmentSpeed;

  return clamp(
    approval,
    0,
    100,
  );
}