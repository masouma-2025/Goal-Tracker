import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Box,
  Divider,
  Avatar,
  Stack,
  Chip,
  Menu,
  MenuItem,
  Tooltip,
  Paper
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import TranslateIcon from "@mui/icons-material/Translate";
import LogoutIcon from "@mui/icons-material/Logout";

import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useApp } from "../context/AppContext";
import { useGoals } from "../context/GoalContext";
import { useState, useMemo, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { useTranslation } from "react-i18next";

export default function Navbar() {

  const { t } = useTranslation();
  const theme = useTheme();

  const { toggleTheme, toggleLanguage, user, logout } = useApp();
  const { userStats } = useGoals();

  const navigate = useNavigate();
  const location = useLocation();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const navLinks = useMemo(() => [
    { label: t("dashboard"), path: "/" },
    { label: t("goals"), path: "/goals" },
    { label: t("categories"), path: "/categories" },
    { label: t("settings"), path: "/settings" }
  ], [t]);

  const isActive = (path) =>
    path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);

  useEffect(() => {
    setDrawerOpen(false);
    setAnchorEl(null);
  }, [location.pathname]);

   useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          backdropFilter: "blur(16px)",
          background:
            theme.palette.mode === "dark"
              ? "rgba(15,23,42,0.7)"
              : "rgba(255,255,255,0.7)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
          transition: "all 0.3s ease",
          py: scrolled ? 0.3 : 1
        }}
      >
        <Toolbar sx={{justifyContent: "space-between",px: { xs: 2, sm: 3, md: 6 } }}>

          {/* LEFT */}
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              onClick={() => setDrawerOpen(true)}
              sx={{ display: { xs: "flex", lg: "none" } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              onClick={() => navigate("/")}
               sx={{
                color: theme.palette.mode === "light" ? "#111827" : "#fff",
                fontWeight: 800
              }}
            >
              🎯 GoalTracker
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={2}
            sx={{ display: { xs: "none", lg: "flex" } }}
          >
            {navLinks.map((link) => (
              <Button
                key={link.path}
                component={NavLink}
                to={link.path}
                sx={{
                  position: "relative",
                  color: "text.primary",
                  fontWeight: isActive(link.path) ? 700 : 400,

                  "&::after": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    bottom: -3,
                    width: isActive(link.path) ? "100%" : "0%",
                    height: "2px",
                    background: "#6366f1",
                    transition: "0.3s"
                  },

                  "&:hover::after": {
                    width: "100%"
                  }
                }}
              >
                {link.label}
              </Button>
            ))}
          </Stack>

          <Stack direction="row" spacing={1} alignItems="center">

            <Chip
              label={`🔥 ${userStats?.streak || 0}`}
              size="small"
              sx={{ display: { xs: "none", sm: "flex" } }}
            />

            <Tooltip title={t("changeLanguage")}>
              <IconButton onClick={toggleLanguage}>
                <TranslateIcon />
              </IconButton>
            </Tooltip>

            <Tooltip title={t("changeTheme")}>
              <IconButton onClick={toggleTheme}>
                {theme.palette.mode === "dark"
                  ? <LightModeIcon />
                  : <DarkModeIcon />}
              </IconButton>
            </Tooltip>

            <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
              <Avatar
                sx={{
                  width: 34,
                  height: 34,
                  border: "2px solid rgba(99,102,241,0.4)"
                }}
              >
                {user?.name?.charAt(0) || "U"}
              </Avatar>
            </IconButton>

          </Stack>

        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        PaperProps={{
          sx: {
            borderRadius: 3,
            minWidth: 180,
            p: 1
          }
        }}
      >
        <MenuItem disabled>
          👤 {user?.name || "Guest"}
        </MenuItem>

        <Divider />

        {user ? (
          <MenuItem onClick={handleLogout}>
            <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
            {t("logout")}
          </MenuItem>
        ) : (
          <MenuItem onClick={() => navigate("/login")}>
            🔐 Login
          </MenuItem>
        )}
      </Menu>

      <Drawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 360 }}>

          <Box sx={{ p: 2 }}>
            <Typography fontWeight="bold">
              🎯 Goal Tracker
            </Typography>
          </Box>

          <Divider />

          <List>
            {navLinks.map((link) => (
              <ListItemButton
                key={link.path}
                component={NavLink}
                to={link.path}
                selected={isActive(link.path)}
              >
                <ListItemText primary={link.label} />
              </ListItemButton>
            ))}
          </List>

        </Box>
      </Drawer>
    </>
  );
}