import { Container, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { keyframes } from "@emotion/react";

export default function NotFound() {
  const navigate = useNavigate();

  const float = keyframes`
    0% { transform: translateY(0px); }
    50% { transform: translateY(-15px); }
    100% { transform: translateY(0px); }
  `;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        p: 2,
      }}
    >
      <Container
        sx={{
          textAlign: "center",
          bgcolor: "white",
          p: { xs: 4, md: 6 },
          borderRadius: 4,
          boxShadow: "0 16px 60px rgba(0,0,0,0.15)",
          transition: "all 0.3s",
          maxWidth: { xs: "90%", sm: "70%", md: "500px" },
        }}
      >
        <ErrorOutlineIcon
          sx={{
            fontSize: { xs: 70, md: 100 },
            color: "#764ba2",
            mb: 2,
            animation: `${float} 3s ease-in-out infinite`,
          }}
        />
        <Typography
          variant="h2"
          sx={{
            fontWeight: "bold",
            mb: 1,
            color: "#182848",
            fontSize: { xs: "3rem", md: "4rem" },
          }}
        >
          404
        </Typography>
        <Typography
          variant="h5"
          sx={{
            mb: 4,
            color: "#495057",
            fontSize: { xs: "1.2rem", md: "1.5rem" },
          }}
        >
          Oops! Page Not Found
        </Typography>

        <Button
          variant="contained"
          onClick={() => navigate("/dashboard")}
          sx={{
            px: 4,
            py: 1.5,
            fontSize: "16px",
            fontWeight: "bold",
            color: "#fff",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            "&:hover": {
              background: "linear-gradient(135deg, #764ba2 0%, #667eea 100%)",
              transform: "scale(1.08)",
            },
            transition: "all 0.3s",
          }}
        >
          Go Back Home
        </Button>
      </Container>
    </Box>
  );
}