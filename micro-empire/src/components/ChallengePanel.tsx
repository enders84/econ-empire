import {
  Box,
  Button,
  Chip,
  Paper,
  Typography,
} from "@mui/material";

import type { GameState } from "../models/GameState";
import { challenges } from "../data/challenges";

interface ChallengePanelProps {
  gameState: GameState;

  onStartChallenge: (
    challengeId: string,
  ) => void;
}

export function ChallengePanel({
  gameState,
  onStartChallenge,
}: ChallengePanelProps) {
  const marketChallenges =
    challenges.filter(
      (challenge) =>
        challenge.marketStructure ===
        gameState.market.structure,
    );

  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: 800,
        }}
      >
        Learning Challenge
      </Typography>

      <Typography
        color="text.secondary"
        sx={{
          mt: 0.5,
          mb: 3,
        }}
      >
        Apply economic theory to your
        firm's decisions.
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
        {marketChallenges.map(
          (challenge) => {
            const isActive =
              gameState.challenges
                .activeChallengeId ===
              challenge.id;

            const isCompleted =
              gameState.challenges
                .completedChallengeIds
                .includes(
                  challenge.id,
                );

            return (
              <Box
                key={challenge.id}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor:
                    isCompleted
                      ? "success.main"
                      : isActive
                        ? "primary.main"
                        : "divider",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                    alignItems: "center",
                    mb: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 800,
                    }}
                  >
                    {challenge.title}
                  </Typography>

                  {isCompleted && (
                    <Chip
                      label="Completed"
                      color="success"
                      size="small"
                    />
                  )}

                  {isActive &&
                    !isCompleted && (
                      <Chip
                        label="In Progress"
                        color="primary"
                        size="small"
                      />
                    )}
                </Box>

                <Typography
                  color="text.secondary"
                >
                  {challenge.description}
                </Typography>
                {isCompleted && (
  <Box
    sx={{
      mt: 2,
      p: 2,
      borderRadius: 2,
      bgcolor:
        "rgba(34, 197, 94, 0.08)",
      border:
        "1px solid rgba(34, 197, 94, 0.25)",
    }}
  >
    <Typography
      sx={{
        fontWeight: 800,
        mb: 0.5,
      }}
    >
      Why this matters
    </Typography>

    <Typography
      color="text.secondary"
    >
      {challenge.successMessage}
    </Typography>
  </Box>
)}
                {!isCompleted &&
                  !isActive && (
                    
                    <Button
                      variant="contained"
                      sx={{
                        mt: 2,
                      }}
                      onClick={() =>
                        onStartChallenge(
                          challenge.id,
                        )
                      }
                    >
                      Start Challenge
                    </Button>
                  )}
              </Box>
            );
          },
        )}
      </Box>
    </Paper>
  );
}