import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
} from "@mui/material";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever"; 
import RestoreIcon from "@mui/icons-material/Restore"; 
import { useAuth } from "../context/AuthContext";
import axios from "axios";


interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  dateCreated: string;
  dateUpdated: string;
}

const Trash: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrashedTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      
      const response = await axios.get<Task[]>(
        `${import.meta.env.VITE_API_BASE_URL}/tasks?status=trash`,
        {
          
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTasks(response.data);
    } catch (err: any) {
      console.error("Failed to fetch trashed tasks:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load trashed tasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTrashedTasks();
    }
  }, [token]);

  
  const handleRestore = async (taskId: string) => {
    if (
      window.confirm(
        "Are you sure you want to restore this task? It will be moved to active tasks.",
      )
    ) {
      try {
        
        await axios.patch(
          `${import.meta.env.VITE_API_BASE_URL}/tasks/restore/${taskId}`,
          {},
          {
            
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        fetchTrashedTasks(); 
      } catch (err) {
        console.error("Failed to restore task:", err);
        const axiosError = err as any;
        if (
          axiosError.response &&
          axiosError.response.data &&
          axiosError.response.data.message
        ) {
          setError(axiosError.response.data.message); 
        } else {
          setError("Failed to restore task from trash.");
        }
      }
    }
  };

  const handlePermanentlyDelete = async (taskId: string) => {
    if (
      window.confirm(
        "WARNING: Are you sure you want to permanently delete this task? This action cannot be undone.",
      )
    ) {
      try {
        
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/tasks/hard-delete/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        fetchTrashedTasks(); 
      } catch (err) {
        console.error("Failed to permanently delete task:", err);
        const axiosError = err as any;
        if (
          axiosError.response &&
          axiosError.response.data &&
          axiosError.response.data.message
        ) {
          setError(axiosError.response.data.message); 
        } else {
          setError("Failed to permanently delete task.");
        }
      }
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        Trash
      </Typography>

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && tasks.length === 0 && (
        <Typography
          variant="h6"
          color="text.secondary"
          sx={{ mt: 4, textAlign: "center" }}
        >
          Your trash is empty.
        </Typography>
      )}

      {!loading && !error && tasks.length > 0 && (
        <List sx={{ width: "100%", bgcolor: "background.paper" }}>
          {tasks.map((task) => (
            <Paper key={task.id} elevation={1} sx={{ mb: 2, p: 2 }}>
              <ListItem
                secondaryAction={
                  <Box>
                    <IconButton
                      edge="end"
                      aria-label="restore"
                      onClick={() => handleRestore(task.id)}
                      sx={{ mr: 1 }}
                    >
                      <RestoreIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="permanently-delete"
                      onClick={() => handlePermanentlyDelete(task.id)}
                    >
                      <DeleteForeverIcon color="error" />{" "}
                      
                    </IconButton>
                  </Box>
                }
              >
                <ListItemText
                  primary={
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: "line-through",
                        color: "text.secondary",
                      }}
                    >
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      sx={{ textDecoration: "line-through" }}
                    >
                      {task.description}
                    </Typography>
                  }
                  sx={{ flexGrow: 1, mr: 2 }}
                />
              </ListItem>
            </Paper>
          ))}
        </List>
      )}
    </Box>
  );
};

export default Trash;
