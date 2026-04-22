import {
  Typography,
  Button,
  Stack,
  TextField,
  Tabs,
  Tab,
  Box,
  MenuItem,
  InputAdornment,
  Grid,
  Container,
  useMediaQuery
} from "@mui/material";

import { useTheme } from "@mui/material/styles";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useGoals } from "../context/GoalContext";
import { useTranslation } from "react-i18next";
import GoalCard from "../components/GoalCard";

export default function GoalsList() {
  const { goals } = useGoals();
  const { t, i18n } = useTranslation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");

  const filteredGoals = useMemo(() => {
    return goals
      .filter(goal => {
        if (filter === "all") return true;
        return goal.status === filter;
      })
      .filter(goal =>
        goal.title?.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sort === "newest") {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        if (sort === "progress") {
          const pa = (a.progress / a.target) || 0;
          const pb = (b.progress / b.target) || 0;
          return pb - pa;
        }
        if (sort === "category") {
          return (a.category || "").localeCompare(b.category || "");
        }
        return 0;
      });
  }, [goals, filter, search, sort]);

  return (
    <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: { xs: 2, md: 4 } }}>
      <Container maxWidth="lg" dir={i18n.language === "fa" ? "rtl" : "ltr"}>

        <Stack
          direction={isMobile ? "column" : "row"}
          spacing={2}
          justifyContent="space-between"
          alignItems={isMobile ? "stretch" : "center"}
          sx={{ mb: 3 }}
        >
          <Typography variant={isMobile ? "h5" : "h4"} fontWeight="bold">
            {t("goals")}
          </Typography>

          <Button
            fullWidth={isMobile}
            variant="contained"
            startIcon={<AddIcon />}
            component={Link}
            to="/goals/new"
            sx={{ borderRadius: 3, textTransform: "none" }}
          >
            {t("createGoal")}
          </Button>
        </Stack>

        <Box
          sx={{
            mb: 4,
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: 2
          }}
        >
          <Stack gap={2} direction={{ xs: "column", md: "row" }}>
  
            <TextField
              fullWidth
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              select
              fullWidth
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <MenuItem value="newest">{t("sortNewest")}</MenuItem>
              <MenuItem value="progress">{t("sortProgress")}</MenuItem>
              <MenuItem value="category">{t("sortCategory")}</MenuItem>
            </TextField>

          </Stack>

          <Tabs
            value={filter}
            onChange={(e, v) => setFilter(v)}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            sx={{ mt: 2 }}
          >
            <Tab label={t("all")} value="all" />
            <Tab label={t("active")} value="active" />
            <Tab label={t("completed")} value="completed" />
            <Tab label={t("paused")} value="paused" />
          </Tabs>
        </Box>

        <Box
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 4,
            bgcolor: "background.paper",
            boxShadow: 2
          }}
        >
          {filteredGoals.length === 0 ? (
            <Typography textAlign="center" color="text.secondary">
              {t("noGoals")}
            </Typography>
          ) : (
            <Grid container spacing={2}>
              {filteredGoals.map(goal => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  lg={3}   
                  key={goal.id}
                >
                  <GoalCard goal={goal} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>

      </Container>
    </Box>
  );
}