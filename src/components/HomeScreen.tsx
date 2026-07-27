import {
  Box,
  Button,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

interface HomeScreenProps {
  onSinglePlayer: () => void;
  onMultiplayer: () => void;
}

export default function HomeScreen({
  onSinglePlayer,
  onMultiplayer,
}: HomeScreenProps) {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        px: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#eef5ff",
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 500,
          p: {
            xs: 3,
            sm: 6,
          },
          textAlign: "center",
        }}
      >
        <Typography
          variant="h3"
          fontWeight="bold"
          gutterBottom
          sx={{
            fontSize: {
              xs: "2.25rem",
              sm: "3rem",
            },
          }}
        >
          🌍 Econ Empire
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 4 }}
        >
          Build the world's strongest economy.
        </Typography>

        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            onClick={onSinglePlayer}
          >
            Single Player
          </Button>

          <Button
            variant="outlined"
            size="large"
            onClick={onMultiplayer}
          >
            Multiplayer Classroom
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}