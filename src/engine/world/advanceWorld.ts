import type { Country } from "../../models/Country";

import { advanceQuarter } from "../advanceQuarter";
import { updateAIPolicy } from "../ai/updateAIPolicy";
import { applyTradeEffects } from "./applyTradeEffects";

export function advanceWorld(
  countries: Country[],
): Country[] {
  const countriesAfterDomesticEconomies =
    countries.map((country) => {
      if (country.isPlayerControlled) {
        return country;
      }

      const countryWithUpdatedPolicy =
        updateAIPolicy(country);

      const nextEconomy = advanceQuarter(
        countryWithUpdatedPolicy.economy,
      );

      return {
        ...countryWithUpdatedPolicy,
        economy: nextEconomy,
      };
    });

  const countriesAfterTrade =
    applyTradeEffects(
      countriesAfterDomesticEconomies,
    );

  return countriesAfterTrade;
}