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
  Checkbox,
  ListItemIcon,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import TaskFormDialog from "../components/TaskFormDialog"; 

interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  dateCreated: string;
  dateUpdated: string;
}

const AllTasks: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState<boolean>(false);
  const [currentTask, setCurrentTask] = useState<Task | null>(null);
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get<Task[]>(
        `${import.meta.env.VITE_API_BASE_URL}/api/tasks?status=active`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setTasks(response.data);
    } catch (err: any) {
      console.error("Failed to fetch tasks:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to load tasks. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchTasks();
    }
  }, [token]);

  const handleToggleComplete = async (
    taskId: string,
    currentStatus: boolean,
  ) => {
    try {
      const endpoint = currentStatus ? "incomplete" : "complete";
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${endpoint}/${taskId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchTasks();
    } catch (err) {
      console.error("Failed to toggle task status:", err);
      setError("Failed to update task status.");
    }
  };

  const handleDelete = async (taskId: string) => {
    if (window.confirm("Are you sure you want to move this task to trash?")) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API_BASE_URL}/api/tasks/${taskId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
        fetchTasks();
      } catch (err) {
        console.error("Failed to delete task:", err);
        setError("Failed to move task to trash.");
      }
    }
  };

  const handleEdit = (task: Task) => {
    setCurrentTask(task);
    setOpenEditDialog(true);
  };
  const handleCloseEditDialog = () => {
    setOpenEditDialog(false);
    setCurrentTask(null);
  };

  const handleSaveEditedTask = async (
    taskId: string | null,
    title: string,
    description: string,
  ) => {
    if (!taskId) {
      setError("Error: Task ID not found for editing.");
      return;
    }
    try {
      await axios.patch(
        `${import.meta.env.VITE_API_BASE_URL}/tasks/${taskId}`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      fetchTasks();
      handleCloseEditDialog();
    } catch (err: any) {
      console.error("Failed to update task:", err);

      throw err;
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        My Active Tasks
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
          No active tasks found. Time to create one!
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
                      aria-label="edit"
                      onClick={() => handleEdit(task)}
                      sx={{ mr: 1 }}
                    >
                      {" "}
                     
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={() => handleDelete(task.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              >
                <ListItemIcon>
                  <Checkbox
                    icon={<CheckCircleOutlineIcon color="disabled" />}
                    checkedIcon={<CheckCircleIcon color="primary" />}
                    checked={task.isCompleted}
                    onChange={() =>
                      handleToggleComplete(task.id, task.isCompleted)
                    }
                    edge="start"
                  />
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography
                      variant="h6"
                      sx={{
                        textDecoration: task.isCompleted
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {task.title}
                    </Typography>
                  }
                  secondary={
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        textDecoration: task.isCompleted
                          ? "line-through"
                          : "none",
                      }}
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

      <TaskFormDialog
        open={openEditDialog}
        onClose={handleCloseEditDialog}
        onSave={handleSaveEditedTask}
        currentTask={currentTask}
      />
    </Box>
  );
};

export default AllTasks;
