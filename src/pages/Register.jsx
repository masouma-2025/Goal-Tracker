import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Stack,
  InputAdornment,
  IconButton,
  Alert
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

import { useNavigate, Link } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useState } from "react";

const getSchema = (t) =>
  yup.object({
    name: yup
      .string()
      .required(t("required"))
      .min(3, t("invalidName") || "Minimum 3 characters"),

    password: yup
      .string()
      .required(t("required"))
      .min(6, t("invalidPassword") || "Minimum 6 characters"),

    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref("password")],
        t("passwordMismatch") || "Passwords must match"
      )
      .required(t("required"))
  });

export default function Register() {
  const { login } = useApp();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(getSchema(t)),
    mode: "onTouched"
  });

  async function onSubmit(data) {
    setLoading(true);
    setErrorMsg("");

    try {
      await new Promise((res) => setTimeout(res, 800));

      login(data.name);
      navigate("/dashboard", { replace: true });

    } catch (err) {
      setErrorMsg(t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 6, md: 10 } }}>
      <Paper
        sx={{
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          transition: "0.3s",
          "&:hover": { transform: "translateY(-5px)" },

          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1e293b, #0f172a)"
              : "linear-gradient(135deg, #f5f7fa, #c3cfe2)"
        }}
      >
        <Typography
          variant="h4"
          mb={3}
          fontWeight="bold"
          textAlign="center"
        >
          {t("register")} 🚀
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            direction: "ltr" 
          }}
        >
          <Stack spacing={3}>

            {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

            <TextField
              label={t("name")}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              disabled={loading}
              autoComplete="username"
              inputProps={{ dir: "ltr" }}
            />

            <TextField
              label={t("password")}
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              disabled={loading}
              autoComplete="new-password"
              inputProps={{ dir: "ltr" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label={t("confirmPassword")}
              type={showConfirm ? "text" : "password"}
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              fullWidth
              disabled={loading}
              autoComplete="new-password"
              inputProps={{ dir: "ltr" }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(p => !p)}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                background: (theme) =>
                  theme.palette.mode === "dark"
                    ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                    : "linear-gradient(135deg, #667eea, #764ba2)"
              }}
            >
              {loading ? t("creating") : t("register")}
            </Button>

            <Typography textAlign="center">
              {t("haveAccount")}{" "}
              <Link
                to="/login"
                style={{
                  textDecoration: "none",
                  fontWeight: "bold"
                }}
              >
                {t("login")}
              </Link>
            </Typography>

          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}