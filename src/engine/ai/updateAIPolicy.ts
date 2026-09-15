import type {
  Country,
  CountryStrategy,
} from "../../models/Country";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number =>
  Math.min(Math.max(value, minimum), maximum);

function adjustByStrategy(
  country: Country,
  strategy: CountryStrategy,
): Country {
  const state = country.economy;

  let incomeTax =
    state.policy.incomeTaxRate;

  let interestRate =
    state.policy.policyInterestRate;

  let education =
    state.policy.educationBudget;

  let healthcare =
    state.policy.healthcareBudget;

  let infrastructure =
    state.policy.infrastructureBudget;

  let science =
    state.policy.scienceBudget;

  let defense =
    state.policy.defenseBudget;

  switch (strategy) {
    case "growth":
      incomeTax -= 1;
      interestRate -= 0.25;
      infrastructure += 1;
      break;

    case "inflation-control":
      interestRate += 0.25;
      break;

    case "social-welfare":
      healthcare += 1;
      education += 1;
      incomeTax += 0.5;
      break;

    case "innovation":
      science += 1.5;
      education += 0.5;
      break;

    case "exports":
      interestRate -= 0.1;
      infrastructure += 1;
      break;

    case "balanced":
      break;
  }

  incomeTax = clamp(
    incomeTax,
    10,
    60,
  );

  interestRate = clamp(
    interestRate,
    0,
    20,
  );

  education = clamp(
    education,
    0,
    100,
  );

  healthcare = clamp(
    healthcare,
    0,
    100,
  );

  infrastructure = clamp(
    infrastructure,
    0,
    100,
  );

  science = clamp(
    science,
    0,
    100,
  );

  defense = clamp(
    defense,
    0,
    100,
  );

  return {
    ...country,

    economy: {
      ...state,

      policy: {
        ...state.policy,

        incomeTaxRate:
          incomeTax,

        policyInterestRate:
          interestRate,

        educationBudget:
          education,

        healthcareBudget:
          healthcare,

        infrastructureBudget:
          infrastructure,

        scienceBudget:
          science,

        defenseBudget:
          defense,
      },

      treasury: {
        ...state.treasury,

        incomeTax:
          incomeTax,

        educationSpending:
          education,

        healthcareSpending:
          healthcare,

        infrastructureSpending:
          infrastructure,

        scienceSpending:
          science,

        defenseSpending:
          defense,
      },

      economy: {
        ...state.economy,

        interestRate:
          interestRate,
      },
    },
  };
}

export function updateAIPolicy(
  country: Country,
): Country {
  if (country.isPlayerControlled) {
    return country;
  }

  return adjustByStrategy(
    country,
    country.strategy,
  );
}