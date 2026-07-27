import type { Country } from "../models/Country";
import type { GameState } from "../models/GameState";

export function createDefaultGameState(): GameState {
  return {
    quarter: 1,

    gdp: 500,
    inflation: 3,
    unemployment: 5,
    debt: 300,
    approval: 60,

    incomeTax: 25,
    educationSpending: 40,
    healthcareSpending: 45,
    defenseSpending: 25,
    infrastructureSpending: 25,
    scienceSpending: 15,
    interestRate: 4.5,
  };
}

export const initialCountries: readonly Country[] = [
  {
    id: "arcadia",
    name: "Arcadia",
    isPlayerControlled: true,
    strategy: "balanced",
    economy: createDefaultGameState(),
  },
  {
    id: "novara",
    name: "Novara",
    isPlayerControlled: false,
    strategy: "growth",
    economy: createDefaultGameState(),
  },
  {
    id: "asteria",
    name: "Asteria",
    isPlayerControlled: false,
    strategy: "innovation",
    economy: createDefaultGameState(),
  },
  {
    id: "solmere",
    name: "Solmere",
    isPlayerControlled: false,
    strategy: "social-welfare",
    economy: createDefaultGameState(),
  },
  {
    id: "rivoria",
    name: "Rivoria",
    isPlayerControlled: false,
    strategy: "exports",
    economy: createDefaultGameState(),
  },
  {
    id: "valkara",
    name: "Valkara",
    isPlayerControlled: false,
    strategy: "inflation-control",
    economy: createDefaultGameState(),
  },
];