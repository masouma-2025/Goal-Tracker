import {
  Container,
  Paper,
  Typography,
  TextField,
  Grid,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Divider,
  Card,
  CardContent,
  FormHelperText
} from "@mui/material";

import { useState } from "react";
import { useGoals } from "../context/GoalContext";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { Stack } from "@mui/material";
export default function CreateGoal() {

  const { createGoal } = useGoals();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    category: "",
    type: "daily",
    target: "",
    startDate: "",
    endDate: "",
    notes: ""
  });

  const [errors, setErrors] = useState({});

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  }

  function validate() {
    let newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = t("required");
    }

    if (!form.category) {
      newErrors.category = t("required");
    }

    if (!form.target || Number(form.target) <= 0) {
      newErrors.target = t("invalidTarget");
    }

    if (form.startDate && form.endDate) {
      if (new Date(form.endDate) < new Date(form.startDate)) {
        newErrors.endDate = t("dateError");
      }
    }

    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();

    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    createGoal(form);
    navigate("/dashboard");
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 5 }}>

      <Typography variant="h4" mb={1}>
        {t("createGoal")}
      </Typography>

      <Typography variant="body2" color="text.secondary" mb={4}>
        {t("createGoalDesc")}
      </Typography>

      <Grid container spacing={4}>

        <Grid item xs={12} md={8}>

          <Paper
            sx={{
              p: 4,
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 2px 10px rgba(0,0,0,0.05)"
            }}
          >

            <Typography variant="h6" mb={3}>
              {t("goalBuilder")}
            </Typography>

            <form onSubmit={handleSubmit}>

              <Stack gap={2} direction={{ xs: "column", md: "row" }}>

              <TextField
                label={t("goalTitle")}
                name="title"
                fullWidth
                size="small"
                value={form.title}
                onChange={handleChange}
                error={!!errors.title}
                helperText={errors.title}
              />

              <FormControl fullWidth size="small" error={!!errors.category}>
                <InputLabel>{t("category")}</InputLabel>

                <Select
                  name="category"
                  value={form.category}
                  label={t("category")}
                  onChange={handleChange}
                >
                  <MenuItem value="Health">{t("Health")}</MenuItem>
                  <MenuItem value="Study">{t("Study")}</MenuItem>
                  <MenuItem value="Work">{t("Work")}</MenuItem>
                  <MenuItem value="Personal">{t("Personal")}</MenuItem>
                </Select>

                <FormHelperText>{errors.category}</FormHelperText>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>{t("goalType")}</InputLabel>

                <Select
                  name="type"
                  value={form.type}
                  label={t("goalType")}
                  onChange={handleChange}
                >
                  <MenuItem value="daily">{t("daily")}</MenuItem>
                  <MenuItem value="count">{t("countBased")}</MenuItem>
                  <MenuItem value="time">{t("timeBased")}</MenuItem>
                </Select>
              </FormControl>

            </Stack>

              <Divider sx={{ my: 3 }} />

              <TextField
                label={t("target")}
                name="target"
                type="number"
                fullWidth
                value={form.target}
                onChange={handleChange}
                error={!!errors.target}
                helperText={errors.target}
                sx={{
                  "& .MuiInputBase-input": {
                    fontSize: "1.2rem",
                    padding: "14px"
                  }
                }}
              />

            <Stack direction={{ xs: "column", md: "row" }} spacing={2} mt={1}>
            <TextField
              label={t("startDate")}
              name="startDate"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={form.startDate}
              onChange={handleChange}
            />

            <TextField
              label={t("endDate")}
              name="endDate"
              type="date"
              fullWidth
              size="small"
              InputLabelProps={{ shrink: true }}
              value={form.endDate}
              onChange={handleChange}
              error={!!errors.endDate}
              helperText={errors.endDate}
            />
          </Stack>

              <Divider sx={{ my: 3 }} />

              <Typography mb={1}>
                {t("notes")}
              </Typography>

              <TextField
                name="notes"
                multiline
                rows={4}
                fullWidth
                placeholder={t("notesPlaceholder")}
                value={form.notes}
                onChange={handleChange}
              />

              <Box mt={4} display="flex" gap={2}>
                <Button variant="outlined" onClick={() => navigate("/goals")}>
                  {t("cancel")}
                </Button>

                <Button type="submit" variant="contained">
                  {t("createGoal")}
                </Button>
              </Box>

            </form>

          </Paper>

        </Grid>

        <Grid item xs={12} md={4}>

          <Card sx={{
            mb: 3,
            borderRadius: 3,
            background: "linear-gradient(135deg, #6a5af9, #8b5cf6)",
            color: "white"
          }}>
            <CardContent>

              <Typography variant="body2">
                {t("livePreview")}
              </Typography>

              <Typography variant="h6">
                {form.title || t("yourGoalTitle")}
              </Typography>

              <Typography variant="body2" mt={1}>
                {t("target")}: {form.target || 0}
              </Typography>

              <Typography variant="body2">
                {t("type")}: {t(form.type)}
              </Typography>

            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent>

              <Typography variant="subtitle1">
                {t("smartTips")}
              </Typography>

              <Typography variant="body2">
                {t("tip1")}
              </Typography>

              <Typography variant="body2">
                {t("tip2")}
              </Typography>

            </CardContent>
          </Card>

        </Grid>

      </Grid>

    </Container>
  );
}