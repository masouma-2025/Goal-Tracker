import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Box } from "@mui/material";

export default function MainLayout() {
  return (
    <>
      <Navbar />
      <Box sx={{ width:"100%", minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Outlet />
      </Box>
    </>
  );
}