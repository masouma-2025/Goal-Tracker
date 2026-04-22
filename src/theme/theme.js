import { createTheme } from "@mui/material/styles";

export default function createAppTheme(mode = "light", direction = "ltr") {
  return createTheme({
    direction,

    palette: {
      mode,

      ...(mode === "dark"
        ? {
            background: {
              default: "#121212",
              paper: "#1e1e1e"
            },
            primary: {
              main: "#4dabf5"
            },
            secondary: {
              main: "#ffb74d"
            },
            text: {
              primary: "#ffffff",
              secondary: "#bbbbbb"
            }
          }
        : {
            background: {
              default: "#f5f7fb",
              paper: "#ffffff"
            },
            primary: {
              main: "#1976d2"
            }
          })
    },

    typography: {
      fontFamily:
        direction === "rtl"
          ? "Vazirmatn, Roboto, sans-serif"
          : "Roboto, sans-serif"
    },

    shape: {
      borderRadius: 5
    },

    components: {

      MuiCssBaseline: {
        styleOverrides: {
          body: {
            transition: "background 0.3s ease"
          }
        }
      },

      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            border: "1px solid rgba(255,255,255,0.06)",
            transition: "0.3s"
          }
        }
      },

      MuiButton: {
        defaultProps: {
          disableElevation: true
        },
        styleOverrides: {
          root: {
            borderRadius: 10,
            textTransform: "none",
            fontWeight: 500
          }
        }
      },

      MuiAppBar: {
        styleOverrides: {
          root: {
            backdropFilter: "blur(10px)",
            background:
              mode === "dark"
                ? "rgba(18,18,18,0.8)"
                : "rgba(255,255,255,0.8)",
            borderBottom: "1px solid rgba(255,255,255,0.08)"
          }
        }
      }
    }
  });
}