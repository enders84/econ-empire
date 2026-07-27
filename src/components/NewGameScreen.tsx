import {
  useMemo,
  useState,
  type FormEvent,
} from "react";

import {
  Box,
  Button,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { countries } from "../data/countries";

import {
  difficulties,
  type DifficultyId,
} from "../data/difficulties";

interface NewGameScreenProps {
  onStartGame: (
    country: string,
    leaderName: string,
    difficulty: string
  ) => void;
}

export default function NewGameScreen({
  onStartGame,
}: NewGameScreenProps) {
  const [countryId, setCountryId] = useState(
    "united-states"
  );

  const [leaderName, setLeaderName] = useState("");

  const [difficultyId, setDifficultyId] =
    useState<DifficultyId>("student");

  const selectedDifficulty = useMemo(
    () =>
      difficulties.find(
        (difficulty) =>
          difficulty.id === difficultyId
      ),
    [difficultyId]
  );

  function handleStartGame(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const selectedCountry = countries.find(
      (country) => country.id === countryId
    );

    if (!selectedCountry || !selectedDifficulty) {
      return;
    }

    const finalLeaderName =
      leaderName.trim() || "President";

    onStartGame(
      selectedCountry.name,
      finalLeaderName,
      selectedDifficulty.label
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eef5ff",
        p: 2,
      }}
    >
      <Paper
        component="form"
        elevation={6}
        onSubmit={handleStartGame}
        sx={{
          width: "100%",
          maxWidth: 600,
          p: {
            xs: 3,
            sm: 5,
          },
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          gutterBottom
        >
          New Game
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Choose your nation, leader, and difficulty.
        </Typography>

        <Stack spacing={3}>
          <TextField
            select
            fullWidth
            label="Country"
            value={countryId}
            onChange={(event) =>
              setCountryId(event.target.value)
            }
          >
            {countries.map((country) => (
  <MenuItem
    key={country.id}
    value={country.id}
  >
    {country.name}
  </MenuItem>
))}
          </TextField>

          <TextField
            fullWidth
            label="Leader Name"
            value={leaderName}
            placeholder="President"
            inputProps={{
              maxLength: 40,
            }}
            helperText={
              leaderName.trim()
                ? "This name will appear throughout the game."
                : 'Leave blank to use "President."'
            }
            onChange={(event) =>
              setLeaderName(event.target.value)
            }
          />

          <TextField
            select
            fullWidth
            label="Difficulty"
            value={difficultyId}
            helperText={
              selectedDifficulty?.description ?? ""
            }
            onChange={(event) =>
              setDifficultyId(
                event.target.value as DifficultyId
              )
            }
          >
            {difficulties.map((difficulty) => (
              <MenuItem
                key={difficulty.id}
                value={difficulty.id}
              >
                {difficulty.label}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            variant="contained"
            size="large"
          >
            Start Game
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}