export interface CostResult {
  fixedCosts: number;
  variableCosts: number;
  totalCosts: number;

  averageFixedCost: number;
  averageVariableCost: number;
  averageTotalCost: number;

  marginalCost: number;
}

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateCosts(
  quantity: number,
  fixedCosts: number,
): CostResult {
  const q = Math.max(quantity, 0);

  /*
   * Variable Cost:
   *
   * VC = 3Q - 0.00015Q² + 0.000000005Q³
   *
   * At lower levels of production, increasing
   * efficiency reduces cost per additional unit.
   *
   * At higher levels of production, diminishing
   * marginal returns cause costs to rise.
   */
  const variableCosts =
    q === 0
      ? 0
      : 3 * q -
        0.00015 * q ** 2 +
        0.000000005 * q ** 3;

  const totalCosts =
    fixedCosts + variableCosts;

  const averageFixedCost =
    q > 0
      ? fixedCosts / q
      : 0;

  const averageVariableCost =
    q > 0
      ? variableCosts / q
      : 0;

  const averageTotalCost =
    q > 0
      ? totalCosts / q
      : 0;

  /*
   * Marginal Cost is the derivative of VC:
   *
   * MC =
   * 3
   * - 0.0003Q
   * + 0.000000015Q²
   */
  const marginalCost =
    q > 0
      ? 3 -
        0.0003 * q +
        0.000000015 * q ** 2
      : 3;

  return {
    fixedCosts:
      round(fixedCosts),

    variableCosts:
      round(variableCosts),

    totalCosts:
      round(totalCosts),

    averageFixedCost:
      round(averageFixedCost),

    averageVariableCost:
      round(averageVariableCost),

    averageTotalCost:
      round(averageTotalCost),

    marginalCost:
      round(marginalCost),
  };
}