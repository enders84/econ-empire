import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import {
  CssBaseline,
  ThemeProvider,
  createTheme,
} from "@mui/material";

import App from "./App.tsx";
import "./index.css";

const theme = createTheme({
  palette: {
    mode: "dark",

    background: {
      default: "#07111f",
      paper: "#111d2e",
    },

    primary: {
      main: "#4da3ff",
    },

    secondary: {
      main: "#7dd3fc",
    },

    success: {
      main: "#4ade80",
    },

    warning: {
      main: "#fbbf24",
    },

    error: {
      main: "#fb7185",
    },

    text: {
      primary: "#f8fafc",
      secondary: "#9fb0c5",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily:
      '"Inter", "Segoe UI", "Roboto", sans-serif',

    h3: {
      fontWeight: 800,
    },

    h5: {
      fontWeight: 700,
    },

    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },

  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(255,255,255,0.08)",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
        },
      },
    },

    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          textTransform: "none",
        },
      },
    },

    MuiSlider: {
      styleOverrides: {
        thumb: {
          width: 18,
          height: 18,
        },

        track: {
          height: 5,
        },

        rail: {
          height: 5,
        },
      },
    },
  },
});

createRoot(
  document.getElementById("root")!,
).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <App />
    </ThemeProvider>
  </StrictMode>,
);