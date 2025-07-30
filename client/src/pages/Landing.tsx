import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { keyframes } from "@emotion/react";

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const backgroundZoomPan = keyframes`
  0% {
    background-size: 100%;
    background-position: center center;
  }
  50% {
    background-size: 105%; /* Subtle zoom in */
    background-position: center center;
  }
  100% {
    background-size: 100%;
    background-position: center center;
  }
`;

const Landing: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: "calc(100vh - 64px)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3,

        backgroundImage: "url(/images/background-image.jpg)",
        backgroundSize: "cover",
        backgroundPosition: "center center",
        backgroundRepeat: "no-repeat",
        animation: `${backgroundZoomPan} 20s ease-in-out infinite alternate`,

        position: "relative",
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)",
          zIndex: 1,
        },
      }}
    >
      <Container maxWidth="md" sx={{ zIndex: 2, position: "relative" }}>
        {" "}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "primary.main",
            mb: 2,
            animation: `${fadeIn} 1s ease-out 0.2s forwards`,
            opacity: 0,
          }}
        >
          Organize Your Life with TaskY
        </Typography>
        <Typography
          variant="h5"
          component="p"
          paragraph
          sx={{
            color: "text.secondary",
            mb: 4,
            animation: `${fadeIn} 1s ease-out 0.4s forwards`,
            opacity: 0,
          }}
        >
          TaskY helps you easily and efficiently manage all your tasks, from
          daily to-dos to long-term projects. Stay productive and focused with a
          simple, intuitive interface.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
            justifyContent: "center",
            animation: `${fadeIn} 10s ease-out 0.6s forwards`,
            opacity: 0,
          }}
        >
          <Button
            variant="contained"
            size="large"
            component={RouterLink}
            to="/register"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.1)",
            }}
          >
            Get Started For Free
          </Button>
          <Button
            variant="outlined"
            size="large"
            component={RouterLink}
            to="/login"
            sx={{
              px: 4,
              py: 1.5,
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "1.1rem",
              borderColor: "primary.main",
              color: "primary.main",
              "&:hover": {
                backgroundColor: "primary.light",
                color: "#FFF",
              },
            }}
          >
            Login to Your Account
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
