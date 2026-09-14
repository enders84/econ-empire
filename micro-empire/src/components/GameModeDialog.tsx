import { useState } from "react";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import type { GameMode } from "../models/Competition";

interface GameModeDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectMode: (mode: GameMode) => void;
}

export function GameModeDialog({
  open,
  onClose,
  onSelectMode,
}: GameModeDialogProps) {
  const [tournamentName, setTournamentName] = useState("");
  const tournamentNameIsValid = tournamentName.trim().length >= 2;

  const startTournament = () => {
    const trimmedName = tournamentName.trim();
    if (trimmedName.length < 2) return;

    sessionStorage.setItem("microEmpirePlayerName", trimmedName);
    onSelectMode("Tournament");
  };

  const startLearning = () => {
    sessionStorage.removeItem("microEmpirePlayerName");
    onSelectMode("Learning");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle sx={{ fontWeight: 800, fontSize: "1.6rem" }}>
        Choose Game Mode
      </DialogTitle>

      <DialogContent>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Choose how you want to play Micro Empire.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
            gap: 2,
          }}
        >
          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Learning Mode
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 3 }}>
              Practice freely with no time limit. Explore market structures,
              experiment with decisions, and complete learning challenges.
            </Typography>

            <Button variant="contained" fullWidth onClick={startLearning}>
              Start Learning Mode
            </Button>
          </Paper>

          <Paper variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
              Tournament Mode
            </Typography>

            <Typography color="text.secondary" sx={{ mb: 2 }}>
              Compete for the highest score over 12 quarters. Profit, market
              share, cash, learning challenges, and strategic decisions affect
              your final score.
            </Typography>

            <TextField
              fullWidth
              label="Student name"
              value={tournamentName}
              onChange={(event) => setTournamentName(event.target.value)}
              helperText="Enter the name that should appear on the class leaderboard."
              slotProps={{ htmlInput: { maxLength: 60 } }}
              sx={{ mb: 2 }}
            />

            <Button
              variant="outlined"
              fullWidth
              disabled={!tournamentNameIsValid}
              onClick={startTournament}
            >
              Start Tournament
            </Button>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
