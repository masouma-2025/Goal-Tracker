import {
  Container,
  Typography,
  Card,
  CardContent,
  Stack,
  Button,
  Box,
  List,
  ListItem,
  ListItemText,
  Chip,
  LinearProgress,
  IconButton,
  Divider
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import AddIcon from "@mui/icons-material/Add";

import { useParams, useNavigate } from "react-router-dom";
import { useGoals } from "../context/GoalContext";
import { useTranslation } from "react-i18next";

export default function GoalDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { goals, addProgress, togglePause, updateGoal } = useGoals();
  const { t } = useTranslation();

  const goal = goals.find(g => String(g.id) === String(id));

  if (!goal) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h5">{t("goalNotFound")}</Typography>
        <Button onClick={() => navigate("/goals")}>
          {t("goals")}
        </Button>
      </Container>
    );
  }

  const logs = goal.logs || [];

  const percent =
    goal.target > 0
      ? Math.min((goal.progress / goal.target) * 100, 100)
      : 0;

  const isCompleted = goal.status === "completed";
  const isPaused = goal.status === "paused";

  function handleComplete() {
    updateGoal(goal.id, {
      status: "completed",
      progress: goal.target,
      updatedAt: new Date().toISOString()
    });
  }

  return (
    <Container sx={{ mt: 4 }}>

      <Stack direction="row" alignItems="center" gap={1} mb={3}>
        <IconButton
          onClick={() => navigate(-1)}
          sx={{
            borderRadius: 2,
            backgroundColor: "action.hover",
            "&:hover": {
              backgroundColor: "primary.main",
              color: "white"
            }
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        <Typography variant="h4" fontWeight="bold">
          {goal.title}
        </Typography>
      </Stack>

      <Card
        sx={{
          mb: 4,
          borderRadius: 4,
          backdropFilter: "blur(10px)",
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "rgba(30,30,40,0.7)"
              : "rgba(255,255,255,0.7)",
          border: "1px solid rgba(255,255,255,0.2)",
          transition: "0.3s",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: "0 15px 40px rgba(0,0,0,0.15)"
          }
        }}
      >
        <CardContent>

          <Stack direction="row" gap={1} mb={2}>
            <Chip
              label={t(goal.category)}
              sx={{
                fontWeight: "bold",
                bgcolor: "primary.light",
                color: "primary.contrastText"
              }}
            />

            <Chip
              label={t(goal.status)}
              color={
                goal.status === "active"
                  ? "primary"
                  : goal.status === "paused"
                  ? "warning"
                  : "success"
              }
              sx={{ fontWeight: "bold" }}
            />
          </Stack>

          <Stack spacing={1}>
            <Typography>
              {t("type")}: {t(goal.type)}
            </Typography>

            <Typography>
              {t("target")}: {goal.target}
            </Typography>

            <Typography>
              {t("progress")}: {goal.progress}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("createdAt")}:{" "}
              {new Date(goal.createdAt).toLocaleDateString()}
            </Typography>
          </Stack>

          <Box mt={3}>
            <LinearProgress
              variant="determinate"
              value={percent}
              sx={{
                height: 10,
                borderRadius: 5
              }}
            />

            <Typography mt={1} variant="body2">
              {Math.round(percent)}%
            </Typography>
          </Box>

        </CardContent>
      </Card>

      <Stack direction="row" gap={2} mb={4} flexWrap="wrap">

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          disabled={isCompleted}
          onClick={() => addProgress(goal.id)}
          sx={{
            borderRadius: 3,
             gap: 1,
            textTransform: "none",
            fontWeight: "bold",
            background: "linear-gradient(135deg, #22c55e, #16a34a)",
            "&:hover": {
              background: "linear-gradient(135deg, #16a34a, #15803d)"
            }
          }}
        >
          {t("addProgress")}
        </Button>

        <Button
          variant="outlined"
          disabled={isCompleted}
          startIcon={isPaused ? <PlayArrowIcon /> : <PauseIcon />}
          onClick={() => togglePause(goal.id)}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
             gap: 1,
          }}
        >
          {isPaused ? t("resume") : t("pause")}
        </Button>

        <Button
          variant="contained"
          color="success"
          disabled={isCompleted}
          startIcon={<CheckCircleIcon />}
          onClick={handleComplete}
          sx={{
            borderRadius: 3,
            textTransform: "none",
            fontWeight: "bold",
             gap: 1,
            boxShadow: "0 4px 12px rgba(34,197,94,0.4)"
          }}
        >
          {t("markComplete")}
        </Button>

      </Stack>

      <Typography variant="h5" mb={2}>
        {t("progressHistory")}
      </Typography>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>

          {logs.length === 0 ? (
            <Typography color="text.secondary">
              {t("noProgressYet")}
            </Typography>
          ) : (
            <List>

              {logs
                .slice()
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((log, index) => (

                  <Box key={index}>
                    <ListItem>

                      <ListItemText
                        primary={
                          new Date(log.date).toLocaleDateString()
                        }
                        secondary={`${t("progress")}: +${log.amount}`}
                      />

                    </ListItem>

                    {index !== logs.length - 1 && <Divider />}
                  </Box>

                ))}

            </List>
          )}

        </CardContent>
      </Card>

    </Container>
  );
}