import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
  Stack,
  IconButton,
  Divider
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import { Link } from "react-router-dom";
import { useState, useMemo } from "react";

import ProgressBar from "./ProgressBar";
import ConfirmDialog from "./ConfirmDialog";
import { useGoals } from "../context/GoalContext";
import { useTranslation } from "react-i18next";

import DeleteIcon from "@mui/icons-material/Delete";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import InfoIcon from "@mui/icons-material/Info";
import AddIcon from "@mui/icons-material/Add";

export default function GoalCard({ goal }) {
  const theme = useTheme();
  const { deleteGoal, togglePause, addProgress } = useGoals();
  const { t } = useTranslation();

  const [openDialog, setOpenDialog] = useState(false);

  const safeGoal = {
    id: goal?.id,
    title: goal?.title || "Untitled",
    status: goal?.status || "active",
    category: goal?.category || "general",
    progress: goal?.progress || 0,
    target: goal?.target || 1,
    startDate: goal?.startDate || "-",
    endDate: goal?.endDate || "-"
  };

  const today = new Date().toISOString().split("T")[0];

  const alreadyLoggedToday = goal.logs?.some(
    log => log.date === today
  );

  const progressPercent = useMemo(() => {
    return Math.min(
      Math.round((safeGoal.progress / safeGoal.target) * 100),
      100
    );
  }, [safeGoal.progress, safeGoal.target]);

  const isCompleted = safeGoal.status === "completed";
  const isPaused = safeGoal.status === "paused";

  const statusConfig = {
    active: { color: "#4f46e5" },
    paused: { color: "#f59e0b" },
    completed: { color: "#22c55e" }
  };

  function handleDelete() {
    deleteGoal(safeGoal.id);
    setOpenDialog(false);
  }

  function handleAdd() {
    addProgress(safeGoal.id, 1);
  }

  function handleToggle() {
    togglePause(safeGoal.id);
  }

  return (
    <>
      <Card
        sx={{
          borderRadius: 4,
          display: "flex",
          flexDirection: "column",
          height: 440, 
          bgcolor: "background.paper",
          border: `1px solid ${theme.palette.divider}`,
          transition: "0.25s ease",
          "&:hover": {
            transform: "translateY(-6px)",
            boxShadow: 6
          },
          opacity: isPaused ? 0.75 : 1
        }}
      >
        <Box
          sx={{
            p: 2,
            color: "#fff",
            backgroundColor: statusConfig[safeGoal.status].color
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              fontWeight="bold"
              sx={{
                fontSize: "1rem",
                maxWidth: "75%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}
            >
              {safeGoal.title}
            </Typography>

            <Chip
              label={t(safeGoal.status)}
              size="small"
              sx={{
                bgcolor: "rgba(255,255,255,0.2)",
                color: "#fff"
              }}
            />
          </Stack>

          <Typography variant="caption" sx={{ opacity: 0.9 }}>
            {t(safeGoal.category)}
          </Typography>
        </Box>

        <CardContent
          sx={{
            flexGrow: 1,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <Box>
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight="bold">
                {safeGoal.progress}/{safeGoal.target}
              </Typography>
              <Typography color="text.secondary">
                {progressPercent}%
              </Typography>
            </Stack>

            <Box mt={1}>
              <ProgressBar value={progressPercent} />
            </Box>
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 1.5,
              borderRadius: 2,
              bgcolor: "action.hover"
            }}
          >
            <Typography variant="caption" display="block">
              {t("start")}: {safeGoal.startDate}
            </Typography>
            <Typography variant="caption" display="block">
              {t("end")}: {safeGoal.endDate}
            </Typography>
          </Box>

          <Button
            fullWidth
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ mt: 2, borderRadius: 2 }}
            onClick={handleAdd}
             disabled={isCompleted || isPaused || (goal.type === "daily" && alreadyLoggedToday)}>
            {isCompleted
              ? t("completed")
              : goal.type === "daily" && alreadyLoggedToday
              ? "Done today"
              : t("addProgress")}
          </Button>

          <Divider sx={{ my: 2 }} />

          <Stack
            direction="row"
            flexWrap="wrap"
            gap={1}
            sx={{ mt: "auto" }}
          >
            <Button
              variant="outlined"
              component={Link}
              to={`/goals/${safeGoal.id}`}
              sx={{ minWidth: 100 }}
            >
              {t("details")}
            </Button>

            <Button
              variant="outlined"
              onClick={handleToggle}
              disabled={isCompleted}
              sx={{ minWidth: 100 }}
            >
              {isPaused ? t("resume") : t("pause")}
            </Button>

            <IconButton
              color="error"
              onClick={() => setOpenDialog(true)}
              sx={{
                border: "1px solid",
                borderColor: "error.main"
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </CardContent>
      </Card>

      <ConfirmDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onConfirm={handleDelete}
        title={t("delete")}
        description={`${t("confirmDelete")} "${safeGoal.title}"`}
      />
    </>
  );
}