import type {
  Country,
  CountryId,
  CountryStrategy,
} from "../models/Country";

import { countries } from "./countries";
import { createDefaultGameState } from "./initialCountries";
import { countryProfiles } from "./countryProfiles";
import { tradePartners } from "./tradePartners";
const strategyByCountry: Record<
  CountryId,
  CountryStrategy
> = {
  "united-states": "balanced",
  china: "exports",
  japan: "innovation",
  germany: "exports",
  india: "growth",
  "united-kingdom": "balanced",
  france: "social-welfare",
  canada: "balanced",
  mexico: "growth",
  brazil: "growth",
  australia: "balanced",
  "south-korea": "innovation",
};

export function createCountries(
  playerCountryId: CountryId,
): Country[] {
  return countries.map((country) => ({
    id: country.id,
    name: country.name,
    flag: country.flag,

    isPlayerControlled:
      country.id === playerCountryId,

    strategy:
      strategyByCountry[country.id],

    economy: (() => {
      const state =
        createDefaultGameState();

      const profile =
        countryProfiles[country.id];

      const debt =
        profile.gdp *
        (profile.debtToGdp / 100);

      const initialHistoryPoint =
        state.history[0];

      return {
        ...state,

        economy: {
          ...state.economy,

          gdp: profile.gdp,
          potentialGdp: profile.gdp,

          inflation:
            profile.inflation,

          unemployment:
            profile.unemployment,

          interestRate:
            profile.interestRate,
        },

        treasury: {
          ...state.treasury,

          debt,

          debtToGdp:
            profile.debtToGdp,
        },

        policy: {
          ...state.policy,

          policyInterestRate:
            profile.interestRate,
        },

        history: [
          {
            ...initialHistoryPoint,

            gdp: profile.gdp,

            potentialGdp:
              profile.gdp,

            inflation:
              profile.inflation,

            unemployment:
              profile.unemployment,

            debt,

            debtToGdp:
              profile.debtToGdp,
          },
        ],
      };
    })(),

    tradePartners: tradePartners[country.id] || [],
    influence: 50,
  }));
}