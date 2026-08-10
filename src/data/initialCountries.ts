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
      businessCycle: "Expansion",
      productivity: 1,

      consumption: 600,
      investment: 200,
      governmentSpending: 200,
      exports: 120,
      imports: 120,

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

      incomeTax: 30,

      educationSpending: 40,
      healthcareSpending: 40,
      defenseSpending: 40,
      infrastructureSpending: 40,
      scienceSpending: 40,
    },

    politics: {
  approval: 50,
  electionYear: 4,
  currentYear: 1,

  lastElectionYear: undefined,
  lastElectionResult: undefined,
},
    policy: {
  incomeTaxRate: 30,

  educationBudget: 40,
  healthcareBudget: 40,
  infrastructureBudget: 40,
  scienceBudget: 40,
  defenseBudget: 40,

  policyInterestRate: 3,
  
},
   history: [
  {
    year: 1,
    quarter: 1,

    gdp: initialGDP,
    gdpGrowth: 0,
    potentialGdp: initialGDP,
    outputGap: 0,

    inflation: 2,
    unemployment: 5,

    debt: initialDebt,
    debtToGdp: (initialDebt / initialGDP) * 100,

    approval: 50,
  },
],
news: [],
  };
}