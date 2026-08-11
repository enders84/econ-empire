import type { Country } from "../../models/Country";

const round = (value: number): number =>
  Math.round(value * 100) / 100;

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number =>
  Math.min(Math.max(value, minimum), maximum);

function getLatestGrowth(
  country: Country,
): number {
  const history = country.economy.history;

  if (history.length === 0) {
    return 0;
  }

  return history[history.length - 1].gdpGrowth;
}

export function applyTradeEffects(
  countries: Country[],
): Country[] {
  return countries.map((country) => {
    const partners = countries.filter(
      (possiblePartner) =>
        country.tradePartners.includes(
          possiblePartner.id,
        ),
    );

    if (partners.length === 0) {
      return country;
    }

    const averagePartnerGrowth =
      partners.reduce(
        (total, partner) =>
          total + getLatestGrowth(partner),
        0,
      ) / partners.length;

    /*
     * Partner growth affects export demand,
     * but the effect is deliberately limited
     * so trade does not overwhelm the domestic
     * economy.
     */
    const exportGrowthEffect = clamp(
      averagePartnerGrowth * 0.15,
      -0.05,
      0.05,
    );

    const previousExports =
      country.economy.economy.exports;

    const newExports = round(
      previousExports *
        (1 + exportGrowthEffect),
    );

    const exportDifference =
      newExports - previousExports;

    const newGdp = round(
      Math.max(
        1,
        country.economy.economy.gdp +
          exportDifference,
      ),
    );

    return {
      ...country,

      economy: {
        ...country.economy,

        economy: {
          ...country.economy.economy,

          exports: newExports,
          gdp: newGdp,
        },
      },
    };
  });
}