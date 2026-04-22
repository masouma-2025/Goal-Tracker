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
  Checkbox,
  FormControlLabel,
  Alert,
  Collapse
} from "@mui/material";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import EmailIcon from "@mui/icons-material/Email";

import { Link, useNavigate } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useTranslation } from "react-i18next";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { useState } from "react";

const schema = yup.object({
  name: yup
    .string()
    .required("Required")
    .min(3, "Minimum 3 characters"),

  email: yup
    .string()
    .required("Required")
    .email("Invalid email"),

  password: yup
    .string()
    .required("Required")
    .min(6, "Password must be at least 6 characters") 
});

export default function Login() {

  const { login } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onTouched"
  });

  async function onSubmit(data) {
    setLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      await new Promise((res) => setTimeout(res, 800));

      login(data.name);

      setSuccessMsg(`${t("welcome")}, ${data.name}`);
      setTimeout(() => navigate("/dashboard"), 800);

    } catch (err) {
      setErrorMsg(err.message);
    }

    setLoading(false);
  }

  return (
    <Container maxWidth="sm" sx={{ mt: { xs: 6, md: 10 } }}>
      <Paper
        sx={{
          p: { xs: 4, md: 5 },
          borderRadius: 4,
          boxShadow: "0 12px 40px rgba(0,0,0,0.15)",

          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(135deg, #1e293b, #0f172a)"
              : "linear-gradient(135deg, #f5f7fa, #c3cfe2)",

          color: "text.primary"
        }}
      >

        <Typography
          variant="h4"
          mb={3}
          fontWeight="bold"
          textAlign="center"
          color="text.primary"
        >
          {t("login")}
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>

            <Collapse in={!!errorMsg}>
              {errorMsg && <Alert severity="error">{errorMsg}</Alert>}
            </Collapse>

            <Collapse in={!!successMsg}>
              {successMsg && <Alert severity="success">{successMsg}</Alert>}
            </Collapse>

            <TextField
              label={t("name")}
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AccountCircle />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label={t("email")}
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailIcon />
                  </InputAdornment>
                )
              }}
            />

            <TextField
              label={t("password")}
              type={showPassword ? "text" : "password"}
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(p => !p)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <FormControlLabel
              control={<Checkbox />}
              label={t("rememberMe")}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{
                py: 1.5,
                fontWeight: "bold",
                background: "linear-gradient(135deg, #667eea, #764ba2)"
              }}
            >
              {loading ? t("loading") : t("login")}
            </Button>

            <Typography textAlign="center">
              {t("noAccount")}{" "}
              <Link
                to="/register"
                style={{
                  fontWeight: "bold",
                  color: "#667eea",
                  textDecoration: "none"
                }}
              >
                {t("register")}
              </Link>
            </Typography>

          </Stack>
        </Box>

      </Paper>
    </Container>
  );
}