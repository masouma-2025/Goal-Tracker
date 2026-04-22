import {
  Typography,
  Button,
  Box,
  Chip,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  Grid,
  Card,
  CardContent
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

import AddIcon from "@mui/icons-material/Add";
import { useApp } from "../context/AppContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useGoals } from "../context/GoalContext";
import { useTranslation } from "react-i18next";
import GoalCard from "../components/GoalCard";
export default function Dashboard() {
  const theme = useTheme();
  const { user } = useApp();
  const { goals, userStats,} = useGoals();
  const { level, progress } = getLevelData(userStats.xpTotal || 0);
  const { t } = useTranslation();

  const [deleteId, setDeleteId] = useState(null);
  const safeGoals = (goals || []).filter(g => g && typeof g === "object");

const activeGoals = safeGoals.filter(g => g.status === "active");
const completedGoals = safeGoals.filter(g => g.status === "completed");

  const completionPercent =
    goals.length === 0
      ? 0
      : Math.round((completedGoals.length / goals.length) * 100);

  function getLevelData(xp) {
    const level = Math.floor(xp / 100);
    const progress = xp % 100;

    return { level, progress };
  }
  const summary = [
  {
    label: t("overallProgress"),
    value: `${completionPercent}%`,
    icon: "📊",
    color: "#6366f1"
  },
  {
    label: t("completed"),
    value: userStats.completedCount || 0,
    icon: "✅",
    color: "#22c55e"
  },
  {
    label: t("streak"),
    value: userStats.streak,
    icon: "🔥",
    color: "#f59e0b"
  },
  {
    label: t("xp"),
    value: userStats.xpTotal,
    icon: "⚡",
    color: "#8b5cf6"
  }
];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: theme.palette.background.default,
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 2, md: 4 },
        mt: 4
      }}
    >
      <Typography variant="h4" fontWeight="bold" mb={4}>
        {t("dashboard")}
      </Typography>
       

     <Box
  sx={{
    borderRadius: 4,
    p: { xs: 3, md: 5 },
    mb: 4,
    color: "#fff",
    background:
      theme.palette.mode === "dark"
        ? "linear-gradient(135deg, #9396da, #a875fa)"
        : "linear-gradient(135deg, #9fbaff, #7c4dff)"
  }}
>
  <Typography variant="overline" sx={{ opacity: 0.85 }}>
    👋 {t("welcomeBack")}
    {user?.name ? `, ${user.name}` : ""}
  </Typography>

  <Typography variant="h4" fontWeight="bold" mt={1}>
    {t("dashboard")}
  </Typography>

  <Typography variant="h5" fontWeight="bold" mt={1}>
    {t("stayfocusedonyourgoals")}
  </Typography> 

  <Stack direction={{ xs: "column", sm: "row" }} gap={2} mt={4}>
    <Button
      variant="contained"
      startIcon={<AddIcon />}
      component={Link}
      to="/goals/new"
      sx={{
        backgroundColor: "#4c1d95",
        borderRadius: 3
      }}
    >
      {t("newGoal")}
    </Button>

    <Button
      variant="outlined"
      component={Link}
      to="/goals"
      sx={{
        color: "#fff",
        borderColor: "#fff",
        borderRadius: 3
      }}
    >
      {t("viewAll")}
    </Button>
  </Stack>
</Box>
      <Grid container spacing={3} alignItems="stretch" mb={5}>
        {summary.map((item, i) => (
          <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }} sx={{ display: "flex" }}>
            <Card
                sx={{
                  width: "100%",
                  borderRadius: 4,
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",

                  background:
                    theme.palette.mode === "dark"
                      ? "rgba(94, 92, 92, 0.35)"
                      : "rgba(255,255,255,0.65)",

                  border:
                    theme.palette.mode === "dark"
                      ? "1px solid rgba(102, 58, 58, 0.86)"
                      : "1px solid rgba(255,255,255,0.4)",

                  boxShadow:
                    theme.palette.mode === "dark"
                      ? "0 10px 30px rgba(0,0,0,0.6)"
                      : "0 10px 30px rgba(0,0,0,0.08)",

                  backdropFilter: "blur(14px)"
                }}
               >
              <CardContent>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  {item.label}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {item.value}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

    <Box
  sx={{
    borderRadius: 4,
    p: { xs: 3, md: 5 },
    mb: 4,
     backgroundColor: theme.palette.background.paper
  }}
>     

      <Typography variant="h5" mb={2}>
        {t("activeGoals")}
      </Typography>

      <Grid container spacing={3} alignItems="stretch">
        {activeGoals.length === 0 && (
          <Box textAlign="center" mt={4} width="100%">
            <Typography color="text.secondary">
              {t("noActiveGoals")}
            </Typography>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              component={Link}
              to="/goals/new"
            >
              {t("createGoal")}
            </Button>
          </Box>
        )}
        
       {activeGoals.map((goal) => (
          <Grid
            key={goal.id}
            item
            xs={12}
            sm={6}
            md={3}
            sx={{ display: "flex" }}
          >
            <GoalCard goal={goal} />
          </Grid>
        ))} 
      </Grid>
     </Box> 
     

<Box
  sx={{
    mt: 6,
    p: { xs: 3, md: 4 },
    borderRadius: 4,
    backgroundColor: theme.palette.background.paper,
    boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
  }}
>
  <Stack
    direction={{ xs: "column", sm: "row" }}
    justifyContent="space-between"
    alignItems={{ xs: "flex-start", sm: "center" }}
    spacing={2}
    mb={3}
  >
    <Box>
      <Typography variant="h6" fontWeight="bold">
        {t("completedGoals")}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {t("yourrecentachievements") || "Recently completed goals"}
      </Typography>
    </Box>

    <Button
      variant="outlined"
      component={Link}
      to="/goals?filter=completed"
      sx={{ borderRadius: 3 }}
    >
      {t("openArchive") || "Open Archive"}
    </Button>
  </Stack>

  {completedGoals.length === 0 && (
    <Box textAlign="center" py={5}>
      <Typography color="text.secondary">
        {t("noCompletedGoals") || "No completed goals yet"}
      </Typography>
    </Box>
  )}

  <Grid container spacing={3} alignItems="stretch">
    {completedGoals.slice(0, 4).map((goal) => (
      <Grid key={goal.id} item xs={12} sm={6} md={4} lg={3}>
        <Card
          sx={{
            p: 2.5,
            borderRadius: 4,
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",

            border: "1px solid",
            borderColor: "divider",

            borderTop: `6px solid ${theme.palette.primary.main}`,

            background:
              theme.palette.mode === "dark"
                ? "rgba(255,255,255,0.03)"
                : "#fafafa",

            boxShadow: "0 6px 20px rgba(0,0,0,0.06)"
          }}
        >
          <CardContent sx={{ p: 0 }}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography fontWeight="bold">
                {goal.title}
              </Typography>

              <Chip
                label={t("completed")}
                size="small"
                sx={{
                  backgroundColor: "#22c55e",
                  color: "#fff",
                  fontWeight: "bold"
                }}
              />
            </Stack>

            <Stack direction="row" gap={1} flexWrap="wrap" mb={2}>
              <Chip
                label={`${t("category")}: ${t(goal.category)}`}
                size="small"
                variant="outlined"
                color="primary"
              />
              <Chip
                label={`${t("type")}: ${goal.type}`}
                size="small"
                variant="outlined"
                color="primary"
              />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              {t("completedAt") || "Completed at"}:{" "}
              {goal.updatedAt
                ? new Date(goal.updatedAt).toLocaleDateString()
                : "-"}
            </Typography>
          </CardContent>
        </Card>
      </Grid>
    ))}
  </Grid>
</Box>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>{t("confirmDelete")}</DialogTitle>

        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>
            {t("cancel")}
          </Button>

          <Button
            color="error"
            onClick={() => {
              deleteGoal(deleteId);
              setDeleteId(null);
            }}
          >
            {t("delete")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}