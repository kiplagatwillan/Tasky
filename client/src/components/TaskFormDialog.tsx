import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert,
} from "@mui/material";

interface Task {
  id: string;
  title: string;
  description: string;
  isCompleted: boolean;
  isDeleted: boolean;
  dateCreated: string;
  dateUpdated: string;
}

interface TaskFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (
    taskId: string | null,
    title: string,
    description: string,
  ) => Promise<void>;
  currentTask: Task | null;
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({
  open,
  onClose,
  onSave,
  currentTask,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
    } else {
      setTitle("");
      setDescription("");
    }
    setError(null);
    setIsSaving(false);
  }, [currentTask, open]);

  const handleLocalSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }
    setIsSaving(true);
    try {
      await onSave(currentTask ? currentTask.id : null, title, description);
      onClose();
    } catch (err: any) {
      setError("Failed to save task. Please try again.");
      console.error("Error saving task in dialog:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{currentTask ? "Edit Task" : "Create New Task"}</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          autoFocus
          margin="dense"
          id="title"
          label="Task Title"
          type="text"
          fullWidth
          variant="outlined"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          sx={{ mb: 2 }}
          required
          error={!!error && title.trim() === ""}
          helperText={
            !!error && title.trim() === "" ? "Task title is required." : ""
          }
        />
        <TextField
          margin="dense"
          id="description"
          label="Description (Optional)"
          type="text"
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={isSaving}>
          Cancel
        </Button>
        <Button
          onClick={handleLocalSave}
          disabled={isSaving}
          variant="contained"
          color="primary"
        >
          {isSaving ? "Saving..." : "Save"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormDialog;
