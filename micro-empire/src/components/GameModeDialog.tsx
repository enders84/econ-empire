import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
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
  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle
        sx={{
          fontWeight: 800,
          fontSize: "1.6rem",
        }}
      >
        Choose Game Mode
      </DialogTitle>

      <DialogContent>
        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Choose how you want to play Micro Empire.
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              md: "1fr 1fr",
            },
            gap: 2,
          }}
        >
          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              Learning Mode
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Practice freely with no time
              limit. Explore market structures,
              experiment with decisions, and
              complete learning challenges.
            </Typography>

            <Button
              variant="contained"
              fullWidth
              onClick={() =>
                onSelectMode("Learning")
              }
            >
              Start Learning Mode
            </Button>
          </Paper>

          <Paper
            variant="outlined"
            sx={{
              p: 3,
              borderRadius: 3,
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: 800,
                mb: 1,
              }}
            >
              Tournament Mode
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 3 }}
            >
              Compete for the highest score
              over 12 quarters. Profit, market
              share, cash, learning challenges,
              and strategic decisions affect
              your final score.
            </Typography>

            <Button
              variant="outlined"
              fullWidth
              onClick={() =>
                onSelectMode("Tournament")
              }
            >
              Start Tournament
            </Button>
          </Paper>
        </Box>
      </DialogContent>
    </Dialog>
  );
}