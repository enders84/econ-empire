import type { GameState } from "../models/GameState";

export function applyFiscalPolicy(next: GameState) {
  const totalSpending =
    next.educationSpending +
    next.healthcareSpending +
    next.defenseSpending +
    next.infrastructureSpending +
    next.scienceSpending;

  // Government spending affects GDP
  next.gdp += (totalSpending - 150) * 0.08;

  // Higher taxes slightly reduce economic activity
  next.gdp -= (next.incomeTax - 25) * 0.2;

  // Government revenue
  const taxRevenue = next.incomeTax * 6;

  // Deficits increase the national debt
  next.debt += totalSpending - taxRevenue;
}