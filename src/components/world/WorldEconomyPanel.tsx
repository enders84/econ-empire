import {
  Box,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import type { Country } from "../../models/Country";

interface WorldEconomyPanelProps {
  countries: Country[];
}

const money = (value: number): string =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);

function getGrowth(country: Country): number {
  const history = country.economy.history;

  if (history.length === 0) {
    return 0;
  }

  return history[history.length - 1].gdpGrowth;
}

export default function WorldEconomyPanel({
  countries,
}: WorldEconomyPanelProps) {
  if (countries.length === 0) {
    return null;
  }

  const totalGdp = countries.reduce(
    (total, country) =>
      total + country.economy.economy.gdp,
    0,
  );

  const averageGrowth =
    countries.reduce(
      (total, country) =>
        total + getGrowth(country),
      0,
    ) / countries.length;

  const averageInflation =
    countries.reduce(
      (total, country) =>
        total +
        country.economy.economy.inflation,
      0,
    ) / countries.length;

  const averageUnemployment =
    countries.reduce(
      (total, country) =>
        total +
        country.economy.economy.unemployment,
      0,
    ) / countries.length;

  const largestEconomy =
    [...countries].sort(
      (a, b) =>
        b.economy.economy.gdp -
        a.economy.economy.gdp,
    )[0];

  const fastestGrowing =
    [...countries].sort(
      (a, b) =>
        getGrowth(b) - getGrowth(a),
    )[0];

  const lowestUnemployment =
    [...countries].sort(
      (a, b) =>
        a.economy.economy.unemployment -
        b.economy.economy.unemployment,
    )[0];

  const lowestDebt =
    [...countries].sort(
      (a, b) =>
        a.economy.treasury.debtToGdp -
        b.economy.treasury.debtToGdp,
    )[0];

  const rankings =
    [...countries].sort(
      (a, b) =>
        b.economy.economy.gdp -
        a.economy.economy.gdp,
    );

  return (
    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
          mb: 3,
        }}
      >
        World Economy
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Global GDP
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 800 }}
          >
            {money(totalGdp)}
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Average Growth
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 800 }}
          >
            {averageGrowth.toFixed(2)}%
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Average Inflation
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 800 }}
          >
            {averageInflation.toFixed(2)}%
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography color="text.secondary">
            Average Unemployment
          </Typography>

          <Typography
            variant="h5"
            sx={{ fontWeight: 800 }}
          >
            {averageUnemployment.toFixed(2)}%
          </Typography>
        </Paper>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          mb: 2,
        }}
      >
        World Leaders
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)",
          },
          gap: 2,
          mb: 4,
        }}
      >
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography color="text.secondary">
            🏆 Largest Economy
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            {largestEconomy.flag}{" "}
            {largestEconomy.name}
          </Typography>

          <Typography>
            {money(
              largestEconomy.economy.economy.gdp,
            )}
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography color="text.secondary">
            🚀 Fastest Growth
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            {fastestGrowing.flag}{" "}
            {fastestGrowing.name}
          </Typography>

          <Typography>
            {getGrowth(fastestGrowing).toFixed(2)}%
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography color="text.secondary">
            📉 Lowest Unemployment
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            {lowestUnemployment.flag}{" "}
            {lowestUnemployment.name}
          </Typography>

          <Typography>
            {lowestUnemployment.economy.economy.unemployment.toFixed(
              2,
            )}
            %
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2 }}>
          <Typography color="text.secondary">
            💰 Lowest Debt / GDP
          </Typography>

          <Typography
            variant="h6"
            sx={{ fontWeight: 800 }}
          >
            {lowestDebt.flag} {lowestDebt.name}
          </Typography>

          <Typography>
            {lowestDebt.economy.treasury.debtToGdp.toFixed(
              1,
            )}
            %
          </Typography>
        </Paper>
      </Box>

      <Typography
        variant="h6"
        sx={{
          fontWeight: 800,
          mb: 2,
        }}
      >
        Country Rankings
      </Typography>

      <Stack spacing={1.5}>
        {rankings.map((country, index) => (
          <Paper
            key={country.id}
            variant="outlined"
            sx={{
              p: 2,
              backgroundColor:
                country.isPlayerControlled
                  ? "action.selected"
                  : "background.default",
            }}
          >
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  md: "50px 2fr repeat(5, 1fr)",
                },
                gap: 2,
                alignItems: "center",
              }}
            >
              <Typography
                sx={{ fontWeight: 800 }}
              >
                #{index + 1}
              </Typography>

              <Box>
                <Typography
                  sx={{ fontWeight: 800 }}
                >
                  {country.flag} {country.name}
                </Typography>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  {country.strategy}
                  {country.isPlayerControlled
                    ? " • Player"
                    : " • AI"}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  GDP
                </Typography>

                <Typography>
                  {money(
                    country.economy.economy.gdp,
                  )}
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Growth
                </Typography>

                <Typography>
                  {getGrowth(country).toFixed(2)}%
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Inflation
                </Typography>

                <Typography>
                  {country.economy.economy.inflation.toFixed(
                    2,
                  )}
                  %
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Unemployment
                </Typography>

                <Typography>
                  {country.economy.economy.unemployment.toFixed(
                    2,
                  )}
                  %
                </Typography>
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Debt / GDP
                </Typography>

                <Typography>
                  {country.economy.treasury.debtToGdp.toFixed(
                    1,
                  )}
                  %
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}