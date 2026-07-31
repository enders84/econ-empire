import type { GameState } from "../models/GameState";

export function createDefaultGameState(): GameState {
  const initialGDP = 1000;
  const initialDebt = 600;

  return {
    quarter: 1,

    economy: {
      gdp: initialGDP,
      potentialGdp: initialGDP,
      outputGap: 0,

      productivity: 1,

      consumption: 650,
      investment: 250,
      governmentSpending: 200,
      exports: 150,
      imports: 50,

      inflation: 2,
      unemployment: 5,
      interestRate: 3,
    },

    treasury: {
      revenue: 0,
      expenses: 0,
      budgetBalance: 0,

      debt: initialDebt,
      debtToGdp: (initialDebt / initialGDP) * 100,
      interestPayments: 0,

      incomeTax: 25,

      educationSpending: 50,
      healthcareSpending: 50,
      defenseSpending: 50,
      infrastructureSpending: 50,
      scienceSpending: 50,
    },

    politics: {
      approval: 50,
      electionYear: 4,
      currentYear: 1,
    },
    policy: {
  incomeTaxRate: 25,

  educationBudget: 50,
  healthcareBudget: 50,
  infrastructureBudget: 50,
  scienceBudget: 50,
  defenseBudget: 50,

  policyInterestRate: 3,
},
    history: [
      {
        year: 1,
        quarter: 1,
        gdp: initialGDP,
        inflation: 2,
        unemployment: 5,
        debt: initialDebt,
        debtToGdp: (initialDebt / initialGDP) * 100,
        approval: 50,
      },
    ],
  };
}