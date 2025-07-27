import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  Paper,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

const NewTask: React.FC = () => {
  const { token } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic client-side validation
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/tasks`,
        { title, description },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setSuccess("Task created successfully!");
      setTitle(""); // Clear form
      setDescription(""); // Clear form

      // Optionally, redirect to the tasks list after a short delay
      setTimeout(() => {
        navigate("/tasks");
      }, 1500);
    } catch (err: any) {
      console.error("Failed to create task:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to create task. Please try again.");
      }
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Paper
        elevation={3}
        sx={{
          mt: 4,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Create New Task
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
          sx={{ mt: 1, width: "100%" }}
        >
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Task Title"
            name="title"
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={!!error && title.trim() === ""} // Show error if title is empty
            helperText={
              !!error && title.trim() === "" ? "Task title is required." : ""
            }
          />
          <TextField
            margin="normal"
            fullWidth
            id="description"
            label="Description (Optional)"
            name="description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, width: "100%" }}>
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" sx={{ mt: 2, width: "100%" }}>
              {success}
            </Alert>
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            CREATE TASK
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default NewTask;
