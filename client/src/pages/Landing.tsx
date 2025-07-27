import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { keyframes } from "@emotion/react"; // For keyframes directly in Emotion

// Define a subtle fade-in animation for text/buttons
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

// Define a subtle background zoom/pan animation
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
        minHeight: "calc(100vh - 64px)", // Full viewport height minus AppBar height (approx 64px)
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        px: 3, // Padding on left/right

        // --- Background Image Styling ---
        backgroundImage: "url(/images/background-image.jpg)", // Path to your image in public/images
        backgroundSize: "cover", // Cover the entire container
        backgroundPosition: "center center", // Center the image
        backgroundRepeat: "no-repeat", // Do not repeat the image
        animation: `${backgroundZoomPan} 20s ease-in-out infinite alternate`, // Apply the animation

        // --- Overlay for readability ---
        position: "relative", // Needed for absolute positioning of overlay
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.7)", // White overlay with 70% opacity
          zIndex: 1, // Place overlay above background image but below content
        },
      }}
    >
      <Container maxWidth="md" sx={{ zIndex: 2, position: "relative" }}>
        {" "}
        {/* Content above overlay */}
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: 700,
            color: "primary.main", // Using theme's primary color
            mb: 2,
            animation: `${fadeIn} 1s ease-out 0.2s forwards`, // Staggered animation
            opacity: 0, // Start invisible
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
            animation: `${fadeIn} 1s ease-out 0.4s forwards`, // Staggered animation
            opacity: 0, // Start invisible
          }}
        >
          TaskY helps you easily and efficiently manage all your tasks, from
          daily to-dos to long-term projects. Stay productive and focused with a
          simple, intuitive interface.
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 2, // Space between buttons
            flexDirection: { xs: "column", sm: "row" }, // Stack on small screens, row on larger
            justifyContent: "center",
            animation: `${fadeIn} 10s ease-out 0.6s forwards`, // Staggered animation
            opacity: 0, // Start invisible
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
                color: "#FFF", // Change text color on hover
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
