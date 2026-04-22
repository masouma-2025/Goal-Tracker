import { ThemeProvider, CssBaseline } from "@mui/material";
import { AppProvider, useApp } from "./context/AppContext";
import { GoalProvider } from "./context/GoalContext";
import createAppTheme from "./theme/theme";
import AppRouter from "./router/AppRouter";
import { useMemo, useEffect } from "react";

function AppContent() {
  const { mode, direction } = useApp();

  const theme = useMemo(
    () => createAppTheme(mode, direction),
    [mode, direction]
  );

  useEffect(() => {
    document.body.dir = direction;
    document.documentElement.dir = direction;
  }, [direction]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline enableColorScheme />

      <AppRouter />
    </ThemeProvider>
  );
}

export default function App() {
  return (
    <AppProvider>
      <GoalProvider>
        <AppContent />
      </GoalProvider>
    </AppProvider>
  );
}