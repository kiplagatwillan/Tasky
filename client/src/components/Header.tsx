import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Avatar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Header: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const getInitials = (
    firstName: string | undefined,
    lastName: string | undefined,
  ): string => {
    if (!firstName && !lastName) return "";
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : "";
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : "";
    return `${firstInitial}${lastInitial}`;
  };

  const handleLogout = () => {
    logout();
    navigate("/"); 
  };

  return (
    <AppBar
      position="static"
      color="transparent"
      elevation={0}
      sx={{ borderBottom: "1px solid #e0e0e0", mb: 4 }}
    >
      <Toolbar sx={{ justifyContent: "space-between", py: 2 }}>
        
        <Typography
          variant="h5"
          sx={{ fontWeight: "bold", color: "primary.main", cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          TASKY
        </Typography>

        
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {isAuthenticated ? (
            <>
              
              <Button
                component={Link}
                to="/tasks"
                color="inherit"
                sx={{ mr: 1, textTransform: "none" }}
              >
                Tasks
              </Button>
              <Button
                component={Link}
                to="/new-task"
                color="inherit"
                sx={{ mr: 1, textTransform: "none" }}
              >
                New Task
              </Button>
              <Button
                component={Link}
                to="/completed-tasks"
                color="inherit"
                sx={{ mr: 1, textTransform: "none" }}
              >
                Completed Tasks
              </Button>
              <Button
                component={Link}
                to="/trash"
                color="inherit"
                sx={{ mr: 1, textTransform: "none" }}
              >
                Trash
              </Button>

              
              <Typography
                variant="body1"
                sx={{ mr: 2, color: "text.secondary" }}
              >
                Welcome back, {user?.firstName || "User"}!
              </Typography>
              <Button
                onClick={() => navigate("/profile")}
                sx={{ p: 0, minWidth: 0 }}
              >
                <Avatar
                  src={user?.avatar || undefined}
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: "primary.light",
                    color: "primary.contrastText",
                  }}
                  alt={
                    user ? `${user.firstName} ${user.lastName}` : "User Avatar"
                  }
                >
                  {getInitials(user?.firstName, user?.lastName)}
                </Avatar>
              </Button>

              
              <Button
                variant="outlined"
                color="primary"
                onClick={handleLogout}
                sx={{ ml: 2, textTransform: "none" }}
              >
                Logout
              </Button>
            </>
          ) : (
            
            <>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ mr: 1, textTransform: "none" }}
              >
                LOGIN
              </Button>
              <Button
                variant="contained"
                color="primary"
                onClick={() => navigate("/register")}
                sx={{ textTransform: "none" }}
              >
                SIGN UP
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
