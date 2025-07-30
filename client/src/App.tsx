import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CssBaseline,
  ThemeProvider,
  createTheme,
  IconButton,
} from "@mui/material";

import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

import AllTasks from "./pages/AllTasks";
import CompletedTasks from "./pages/CompletedTasks";
import Trash from "./pages/Trash";
import NewTask from "./pages/NewTask";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#4CAF50" },
    secondary: { main: "#FFA000" },
    background: { default: "#F5F5F5", paper: "#FFFFFF" },
    text: { primary: "#333333", secondary: "#666666" },
  },
  typography: {
    fontFamily: "Roboto, sans-serif",
    h4: { fontWeight: 600, color: "#333333" },
    h5: { fontWeight: 500, color: "#444444" },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "8px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#FFFFFF",
          color: "#333333",
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.05)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: "12px",
          padding: "16px",
        },
      },
    },
  },
});

const AppContent: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <AppBar position="static">
          <Toolbar>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: 1,
                textDecoration: "none",
                color: lightTheme.palette.primary.main,
                fontWeight: "bold",
              }}
            >
              TaskY
            </Typography>

            {user ? (
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Button
                  component={RouterLink}
                  to="/tasks"
                  sx={{ mx: 1, color: lightTheme.palette.text.primary }}
                >
                  My Active Tasks
                </Button>
                <Button
                  component={RouterLink}
                  to="/new-task"
                  sx={{ mx: 1, color: lightTheme.palette.text.primary }}
                >
                  New Task
                </Button>
                <Button
                  component={RouterLink}
                  to="/completed-tasks"
                  sx={{ mx: 1, color: lightTheme.palette.text.primary }}
                >
                  Completed Tasks
                </Button>
                <Button
                  component={RouterLink}
                  to="/trash"
                  sx={{ mx: 1, color: lightTheme.palette.text.primary }}
                >
                  Trash
                </Button>
                <Button
                  component={RouterLink}
                  to="/profile"
                  sx={{ mx: 1, color: lightTheme.palette.text.primary }}
                >
                  Welcome, {user.firstName}!
                </Button>
                <Button
                  onClick={logout}
                  sx={{
                    ml: 2,
                    bgcolor: lightTheme.palette.secondary.main,
                    "&:hover": { bgcolor: lightTheme.palette.secondary.dark },
                    color: "#FFF",
                  }}
                >
                  Logout
                </Button>
              </Box>
            ) : (
              <Box>
                <Button
                  component={RouterLink}
                  to="/login"
                  sx={{ mr: 1, color: lightTheme.palette.text.primary }}
                >
                  Login
                </Button>
                <Button
                  variant="contained"
                  component={RouterLink}
                  to="/register"
                  sx={{
                    bgcolor: lightTheme.palette.primary.main,
                    "&:hover": { bgcolor: lightTheme.palette.primary.dark },
                    color: "#FFF",
                  }}
                >
                  Sign Up
                </Button>
              </Box>
            )}
          </Toolbar>
        </AppBar>

        <Box sx={{ flexGrow: 1, mt: 2, p: 2 }}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/tasks" element={<AllTasks />} />
            <Route path="/new-task" element={<NewTask />} />
            <Route path="/completed-tasks" element={<CompletedTasks />} />
            <Route path="/trash" element={<Trash />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </Box>

        <Box
          component="footer"
          sx={{
            py: 3, // Reduced from 4 to 3 for smaller size
            px: 2,
            backgroundColor: '#FFFFFF', // Set to white based on image
            color: lightTheme.palette.text.secondary, // Keep text secondary color for contrast on white
            boxShadow: '0px -2px 8px rgba(0, 0, 0, 0.05)', // Adjusted shadow for lighter background
            textAlign: 'center',
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            mt: 4,
          }}
        >
          <Typography variant="caption" sx={{ fontWeight: 500, mb: 1 }}> {/* Changed to caption variant for smaller text */}
            © {new Date().getFullYear()} TaskY. All rights reserved.
          </Typography>
          <Box sx={{ mt: 1 }}>
            <IconButton
              component="a"
              href="https://github.com/kiplagatwillan/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit" // Inherits text color from parent Box
              sx={{ mx: 1, fontSize: '1.2rem' }} // Smaller icon size
            >
              <GitHubIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              component="a"
              href="https://www.instagram.com/"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ mx: 1, fontSize: '1.2rem' }}
            >
              <InstagramIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              component="a"
              href="https://x.com/home"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ mx: 1, fontSize: '1.2rem' }}
            >
              <TwitterIcon fontSize="inherit" />
            </IconButton>
            <IconButton
              component="a"
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              color="inherit"
              sx={{ mx: 1, fontSize: '1.2rem' }}
            >
              <FacebookIcon fontSize="inherit" />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

const App: React.FC = () => (
  <Router>
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  </Router>
);

export default App;