import {
  Container,
  Paper,
  Typography,
  Avatar,
  Box,
  Button,
  TextField,
  Stack,
  Chip,
  LinearProgress
} from "@mui/material";

import { useApp } from "../context/AppContext";
import { useGoals } from "../context/GoalContext";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Profile() {

  const { user, login, logout } = useApp();
  const { userStats } = useGoals();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [editName, setEditName] = useState(user?.name || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

 
  const { level, progress } = useMemo(() => {
    const xp = userStats?.xpTotal || 0;
    return {
      level: Math.floor(xp / 100) + 1,
      progress: xp % 100
    };
  }, [userStats]);

 
  function handleUpdate() {

    const trimmed = editName.trim();

    if (!trimmed) {
      setError(t("required"));
      setSuccess(false);
      return;
    }

    if (trimmed === user.name) return;

    login(trimmed);

    setError("");
    setSuccess(true);
  }

  
  if (!user) {
    return (
      <Container sx={{ mt: 6 }}>
        <Typography variant="h5">
          {t("notLoggedIn")}
        </Typography>

        <Button
          variant="contained"
          sx={{ mt: 2 }}
          onClick={() => navigate("/login")}
        >
          {t("goToLogin")}
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>

      <Paper
        sx={{
          p: 4,
          borderRadius: 4,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
        }}
      >

        <Box textAlign="center">

          <Avatar
            sx={{
              width: 90,
              height: 90,
              margin: "auto",
              mb: 2,
              bgcolor: "primary.main",
              fontSize: 32
            }}
          >
            {user?.name?.charAt(0)?.toUpperCase() || "U"}
          </Avatar>

          <Typography variant="h5" fontWeight="bold">
            {user.name}
          </Typography>

          <Stack
            direction="row"
            justifyContent="center"
            spacing={1}
            mt={2}
            flexWrap="wrap"
          >
            <Chip label={`Lv.${level}`} color="warning" />
            <Chip label={`🔥 ${userStats?.streak || 0}`} color="error" />
            <Chip label={`XP ${userStats?.xpTotal || 0}`} color="primary" />
          </Stack>

          <Box mt={2}>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 5
              }}
            />
          </Box>

        </Box>

        <Box mt={4}>

          <Typography variant="h6" mb={1}>
            {t("editName")}
          </Typography>

          <TextField
            fullWidth
            value={editName}
            onChange={(e) => {
              setEditName(e.target.value);
              setError("");
              setSuccess(false);
            }}
            error={!!error}
            helperText={error}
          />

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 2 }}
            onClick={handleUpdate}
            disabled={!editName.trim() || editName === user.name}
          >
            {t("updateName")}
          </Button>

          {success && (
            <Typography
              color="success.main"
              mt={1}
              fontSize="0.9rem"
            >
              {t("updateSuccess") || "Updated successfully!"}
            </Typography>
          )}

        </Box>

        <Box mt={4}>

          <Button
            fullWidth
            color="error"
            variant="outlined"
            onClick={() => {
              logout();
              navigate("/login");
            }}
          >
            {t("logout")}
          </Button>

        </Box>

      </Paper>

    </Container>
  );
}