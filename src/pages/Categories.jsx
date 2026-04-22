import { useMemo } from "react";
import { useGoals } from "../context/GoalContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  LinearProgress,
  useTheme,
  Container,
  Divider
} from "@mui/material";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from "recharts";

const defaultCategories = ["Health", "Study", "Work", "Personal"];

export default function Categories() {
  const { goals } = useGoals();
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();

  const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444"];
  
  const categoryStats = useMemo(() => {
    const stats = {};

    defaultCategories.forEach(cat => {
      stats[cat] = {
        total: 0,
        active: 0,
        completed: 0,
        paused: 0,
        totalProgress: 0,
        totalTarget: 0,
        percent: 0
      };
    });

    goals.forEach(goal => {
      const cat = goal.category
      ? goal.category.charAt(0).toUpperCase() + goal.category.slice(1).toLowerCase()
      : "Other";

      if (!stats[cat]) {
        stats[cat] = {
          total: 0,
          active: 0,
          completed: 0,
          paused: 0,
          totalProgress: 0,
          totalTarget: 0,
          percent: 0
        };
      }

      stats[cat].total++;

      if (goal.status === "completed") stats[cat].completed++;
      else if (goal.status === "active") stats[cat].active++;
      else if (goal.status === "paused") stats[cat].paused++;

      stats[cat].totalProgress += goal.progress || 0;
      stats[cat].totalTarget += goal.target || 0;
    });

    Object.keys(stats).forEach(cat => {
      const item = stats[cat];
      item.percent =
        item.totalTarget > 0
          ? (item.totalProgress / item.totalTarget) * 100
          : 0;
    });

    return stats;
  }, [goals]);

  const bestCategory = useMemo(() => {
  const entries = Object.entries(categoryStats);
  if (!entries.length) return null;

  return entries.reduce((best, current) => {
    return current[1].percent > (best?.[1]?.percent || 0)
      ? current
      : best;
  }, null);
}, [categoryStats]);

  const pieData = Object.entries(categoryStats).map(([cat, data]) => ({
    name: t(cat),
    value: Math.round(data.percent)
  }));

  const totalGoals = goals.length;
  const summary = useMemo(() => {
  const entries = Object.entries(categoryStats);

  const totalCategories = entries.length;

  let mostActive = { name: "-", count: 0 };
  let bestProgress = { name: "-", percent: 0 };
  let emptyCategories = 0;

  entries.forEach(([cat, data]) => {
    if (data.active > mostActive.count) {
      mostActive = { name: cat, count: data.active };
    }

    if (data.percent > bestProgress.percent) {
      bestProgress = { name: cat, percent: data.percent };
    }

    if (data.total === 0) {
      emptyCategories++;
    }
  });

  return [
    {
      label: t("totalCategories") || "Total Categories",
      value: totalCategories
    },
    {
      label: t("mostActiveCategory") || "Most Active",
      value: t(mostActive.name)
    },
    {
      label: t("bestProgressCategory") || "Best Progress",
      value: t(bestProgress.name)
    },
    {
      label: t("emptyCategories") || "Empty Categories",
      value: emptyCategories
    }
  ];
}, [categoryStats, t]);
  if (goals.length === 0) {
    return (
      <Container maxWidth="md">
        <Typography sx={{ mt: 6, textAlign: "center" }}>
          {t("noGoals") || "No goals yet"}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          {t("categories")}
        </Typography>

       
      </Box>
   
      <Divider sx={{ mb: 4 }} />
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
          mb: 5,
          p: 3,
          borderRadius: 4,
          backdropFilter: "blur(12px)",
          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.05)"
              : "rgba(255,255,255,0.7)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
        }}
      >
        <Box sx={{ height: { xs: 260, md: 340 } }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
                paddingAngle={4}
              >
                {pieData.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center"
            }}
          >
            <Typography variant="h5" fontWeight="bold">
              {totalGoals}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {t("totalGoals")}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Box
        sx={{
          mt: 4,
          p: 4,
          borderRadius: 4,
          background:
            theme.palette.mode === "dark"
              ? "rgba(255,255,255,0.03)"
              : "rgba(255,255,255,0.6)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 10px 25px rgba(0,0,0,0.08)"
        }}
      >
        <Typography variant="h6" fontWeight="bold" mb={3}>
          {t("categories")}
        </Typography>

        <Grid container spacing={3} justifyContent={{ xs: "center", md: "flex-start" }}>
          {Object.entries(categoryStats).map(([cat, data], i) => (
            <Grid item xs={12} sm={6} md={4} key={cat}>
              
              <Card
                onClick={() => navigate(`/goals?category=${cat}`)}
                sx={{
                  cursor: "pointer",
                  borderRadius: 4,
                  transition: "0.3s",
                  p: 1,
                  background: `linear-gradient(135deg, ${COLORS[i]}22, transparent)`,
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 12px 30px rgba(0,0,0,0.2)"
                  }
                }}
              >

                <CardContent>

                  <Typography variant="h6" fontWeight="bold">
                    {t(cat)}
                  </Typography>

                  <Box mt={1} mb={1}  sx={{ display: "flex", gap: 1, flexWrap: "wrap"}}>
                    <Chip label={`${t("active")} ${data.active}`} size="small" sx={{ mr: 1 }} />
                    <Chip label={`${t("completed")} ${data.completed}`} size="small" color="success" />
                    <Chip label={`${t("paused")} ${data.paused}`} size="small" color="warning" />
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    {t("totalGoals")}: {data.total}
                  </Typography>

                  <Box mt={2}>
                    <LinearProgress
                      variant="determinate"
                      value={data.percent}
                      sx={{ height: 8, borderRadius: 5 }}
                    />
                    <Typography variant="caption">
                      {Math.round(data.percent)}%
                    </Typography>
                  </Box>

                </CardContent>

              </Card>

            </Grid>
          ))}
        </Grid>
      </Box>

    </Container>
  );
}