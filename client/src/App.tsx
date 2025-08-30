import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link as RouterLink,
  useLocation, 
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
  const location = useLocation(); 

  
  const showFooter = location.pathname === "/";

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

        {showFooter && (
          <Box
            component="footer"
            sx={{
              py: 4,
              px: 2,
             backgroundColor: "#0f172a",
            
             color: "#FFF",
              textAlign: "center",
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              mt: 4,
              boxShadow: "0px -4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
              TaskY
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, maxWidth: "600px", mx: "auto" }}>
              The simple way to get things done. Stay organized, collaborate with others, and achieve your goals.
            </Typography>
            <Box sx={{ mt: 1 }}>
              <IconButton
                component="a"
                href="https://github.com/kiplagatwillan/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#FFF",
                  mx: 1,
                  transition: "transform 0.3s ease, color 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.3)",
                    color: lightTheme.palette.secondary.main,
                    backgroundColor: "transparent",
                  },
                }}
              >
                <GitHubIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://www.instagram.com/"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#FFF",
                  mx: 1,
                  transition: "transform 0.3s ease, color 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.3)",
                    color: lightTheme.palette.secondary.main,
                    backgroundColor: "transparent",
                  },
                }}
              >
                <InstagramIcon />
              </IconButton>
              <IconButton
                component="a"
                href="https://x.com/home"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#FFF",
                  mx: 1,
                  transition: "transform 0.3s ease, color 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.3)",
                    color: lightTheme.palette.secondary.main,
                    backgroundColor: "transparent",
                  },
                }}
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                component="a"
                href="#"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "#FFF",
                  mx: 1,
                  transition: "transform 0.3s ease, color 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.3)",
                    color: lightTheme.palette.secondary.main,
                    backgroundColor: "transparent",
                  },
                }}
              >
                <FacebookIcon />
              </IconButton>
            </Box>
            <Typography variant="caption" sx={{ mt: 2, display: "block" }}>
              © {new Date().getFullYear()} TaskY. All rights reserved.
            </Typography>
          </Box>
        )}
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