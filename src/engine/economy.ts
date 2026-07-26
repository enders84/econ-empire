import type { GameState } from "../models/GameState";

export function updateEconomy(next: GameState) {
  const education = Number(next.educationSpending);
  const healthcare = Number(next.healthcareSpending);
  const defense = Number(next.defenseSpending);
  const infrastructure = Number(next.infrastructureSpending);
  const science = Number(next.scienceSpending);

  console.log("Ministry spending values:", {
    education,
    healthcare,
    defense,
    infrastructure,
    science,
  });

  const spendingValues = [
    education,
    healthcare,
    defense,
    infrastructure,
    science,
  ];

  if (spendingValues.some((value) => !Number.isFinite(value))) {
    console.error("Invalid ministry spending values:", {
      educationSpending: next.educationSpending,
      healthcareSpending: next.healthcareSpending,
      defenseSpending: next.defenseSpending,
      infrastructureSpending: next.infrastructureSpending,
      scienceSpending: next.scienceSpending,
    });

    return;
  }

  const totalSpending =
    education +
    healthcare +
    defense +
    infrastructure +
    science;

  next.gdp += (Math.random() - 0.5) * 6;

  next.inflation +=
    (totalSpending - 150) * 0.01 +
    (Math.random() - 0.5) * 0.3;

  next.unemployment -=
    (totalSpending - 150) * 0.01;

  next.unemployment +=
    (Math.random() - 0.5) * 0.25;
}