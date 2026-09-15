import {
  Box,
  Chip,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";

import type { GameState } from "../models/GameState";

interface CompetitionPanelProps {
  gameState: GameState;
}

export function CompetitionPanel({
  gameState,
}: CompetitionPanelProps) {
  const competition = gameState.competition;

  const displayQuarter = competition.isFinished
    ? competition.totalQuarters
    : Math.min(
        competition.quartersPlayed + 1,
        competition.totalQuarters,
      );

  const progress =
    (competition.quartersPlayed /
      competition.totalQuarters) *
    100;

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 800 }}
        >
          Tournament
        </Typography>

        <Chip
          label={
            competition.isFinished
              ? "Finished"
              : "In Progress"
          }
          color={
            competition.isFinished
              ? "success"
              : "primary"
          }
        />
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
        }}
      >
        <Typography>
          Quarter {displayQuarter} of{" "}
          {competition.totalQuarters}
        </Typography>

        <Typography
          sx={{ fontWeight: 800 }}
        >
          Score:{" "}
          {competition.score.toLocaleString()}
        </Typography>
      </Box>

      <LinearProgress
        variant="determinate"
        value={Math.min(progress, 100)}
        sx={{
          height: 10,
          borderRadius: 5,
        }}
      />

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1.5 }}
      >
        Build the strongest firm possible
        before the tournament ends.
      </Typography>
    </Paper>
  );
}
