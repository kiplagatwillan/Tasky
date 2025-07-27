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
} from "@mui/material";
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
    primary: {
      main: "#4CAF50", 
    },
    secondary: {
      main: "#FFA000", 
    },
    background: {
      default: "#F5F5F5", 
      paper: "#FFFFFF", 
    },
    text: {
      primary: "#333333",
      secondary: "#666666",
    },
  },
  typography: {
    fontFamily: "Roboto, sans-serif", 
    h4: {
      fontWeight: 600,
      color: "#333333",
    },
    h5: {
      fontWeight: 500,
      color: "#444444",
    },
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
                color="inherit"
                component={RouterLink}
                to="/tasks"
                sx={{ mx: 1, color: lightTheme.palette.text.primary }}
              >
                My Active Tasks
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/new-task"
                sx={{ mx: 1, color: lightTheme.palette.text.primary }}
              >
                New Task
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/completed-tasks"
                sx={{ mx: 1, color: lightTheme.palette.text.primary }}
              >
                Completed Tasks
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/trash"
                sx={{ mx: 1, color: lightTheme.palette.text.primary }}
              >
                Trash
              </Button>
              <Button
                color="inherit"
                component={RouterLink}
                to="/profile"
                sx={{ mx: 1, color: lightTheme.palette.text.primary }}
              >
                Welcome, {user.firstName}!
              </Button>
              <Button
                color="inherit"
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
                color="inherit"
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
      
      <Box sx={{ mt: 2, p: 2 }}>
        {" "}
        
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/tasks" element={<AllTasks />} />
          <Route path="/new-task" element={<NewTask />} />
          <Route path="/completed-tasks" element={<CompletedTasks />} />
          <Route path="/trash" element={<Trash />} />
          <Route path="/profile" element={<Profile />} />{" "}
          
        </Routes>
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
