import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Switch,
  FormControlLabel,
  Button,
  Divider,
  useTheme
} from "@mui/material";

import LanguageIcon from "@mui/icons-material/Language";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";

import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Settings() {

  const { mode, toggleTheme, language, logout } = useApp();
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(
    JSON.parse(localStorage.getItem("notifications")) ?? true
  );

  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
  }, [notifications]);

  function changeLanguage(lang) {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  }

  function handleLogout() {
    logout();
    navigate("/login");
  }

  return (
    <Container sx={{ mt: 4 }}>

      <Typography variant="h4" fontWeight="bold" mb={3}>
        ⚙️ {t("settings")}
      </Typography>

      <Stack spacing={3}>

        <Card
          sx={{
            borderRadius: 4,
            background:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)"
          }}
        >
          <CardContent>

            <Stack direction="row" spacing={2} mb={2}>
              <LanguageIcon />
              <Typography variant="h6">{t("language")}</Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Stack direction="row" gap={2}>
              <Button
                variant={language === "en" ? "contained" : "outlined"}
                onClick={() => changeLanguage("en")}
              >
                English
              </Button>

              <Button
                variant={language === "fa" ? "contained" : "outlined"}
                onClick={() => changeLanguage("fa")}
              >
                فارسی
              </Button>
            </Stack>

          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 4,
            background:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)"
          }}
        >
          <CardContent>

            <Stack direction="row" spacing={1} mb={2}>
              <DarkModeIcon />
              <Typography variant="h6">{t("theme")}</Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={mode === "dark"}
                  onChange={toggleTheme}
                />
              }
              label={
                mode === "dark"
                  ? t("darkMode")
                  : t("lightMode")
              }
            />

          </CardContent>
        </Card>

        <Card
          sx={{
            borderRadius: 4,
            background:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.05)"
                : "rgba(255,255,255,0.8)",
            backdropFilter: "blur(10px)"
          }}
        >
          <CardContent>

            <Stack direction="row" spacing={1} mb={2}>
              <NotificationsIcon />
              <Typography variant="h6">
                {t("notifications") || "Notifications"}
              </Typography>
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <FormControlLabel
              control={
                <Switch
                  checked={notifications}
                  onChange={() => setNotifications(prev => !prev)}
                />
              }
              label={
                notifications
                  ? (t("enabled") || "Enabled")
                  : (t("disabled") || "Disabled")
              }
            />

          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 4 }}>
          <CardContent>

            <Button
              fullWidth
              variant="contained"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
            >
              {t("logout") || "Logout"}
            </Button>

          </CardContent>
        </Card>

      </Stack>
    </Container>
  );
}