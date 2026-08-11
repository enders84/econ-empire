import type { CountryId } from "../models/Country";

export interface CountryProfile {
  gdp: number;
  inflation: number;
  unemployment: number;
  debtToGdp: number;
  interestRate: number;
}

export const countryProfiles: Record<
  CountryId,
  CountryProfile
> = {
  "united-states": {
    gdp: 1000,
    inflation: 2.0,
    unemployment: 5.0,
    debtToGdp: 60,
    interestRate: 3.0,
  },

  china: {
    gdp: 820,
    inflation: 1.8,
    unemployment: 5.2,
    debtToGdp: 55,
    interestRate: 2.5,
  },

  japan: {
    gdp: 520,
    inflation: 1.5,
    unemployment: 3.0,
    debtToGdp: 130,
    interestRate: 1.0,
  },

  germany: {
    gdp: 460,
    inflation: 2.0,
    unemployment: 4.5,
    debtToGdp: 65,
    interestRate: 2.5,
  },

  india: {
    gdp: 390,
    inflation: 4.5,
    unemployment: 7.0,
    debtToGdp: 80,
    interestRate: 5.0,
  },

  "united-kingdom": {
    gdp: 340,
    inflation: 2.5,
    unemployment: 4.5,
    debtToGdp: 90,
    interestRate: 3.5,
  },

  france: {
    gdp: 320,
    inflation: 2.2,
    unemployment: 7.5,
    debtToGdp: 110,
    interestRate: 2.5,
  },

  canada: {
    gdp: 220,
    inflation: 2.0,
    unemployment: 5.5,
    debtToGdp: 70,
    interestRate: 3.0,
  },

  mexico: {
    gdp: 180,
    inflation: 4.0,
    unemployment: 4.0,
    debtToGdp: 50,
    interestRate: 6.0,
  },

  brazil: {
    gdp: 210,
    inflation: 4.5,
    unemployment: 7.5,
    debtToGdp: 85,
    interestRate: 7.0,
  },

  australia: {
    gdp: 170,
    inflation: 2.5,
    unemployment: 4.5,
    debtToGdp: 55,
    interestRate: 3.5,
  },

  "south-korea": {
    gdp: 190,
    inflation: 2.0,
    unemployment: 3.5,
    debtToGdp: 50,
    interestRate: 3.0,
  },
};