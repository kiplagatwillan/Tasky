import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Alert
} from '@mui/material';

// Define the Task type to ensure consistency
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
  onSave: (taskId: string | null, title: string, description: string) => Promise<void>;
  currentTask: Task | null; // Null for new task, Task object for editing
}

const TaskFormDialog: React.FC<TaskFormDialogProps> = ({ open, onClose, onSave, currentTask }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // When currentTask changes (i.e., when dialog opens for editing), populate the form
  useEffect(() => {
    if (currentTask) {
      setTitle(currentTask.title);
      setDescription(currentTask.description);
    } else {
      // Clear form for new task (though we are using this for edit primarily for now)
      setTitle('');
      setDescription('');
    }
    setError(null); // Clear errors on dialog open/task change
    setIsSaving(false);
  }, [currentTask, open]);

  const handleLocalSave = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    setIsSaving(true);
    try {
      await onSave(currentTask ? currentTask.id : null, title, description);
      onClose(); // Close dialog on successful save
    } catch (err: any) {
      // Error will be handled by the parent component's onSave,
      // but we can also display a general error here if onSave doesn't throw
      // specific displayable error or needs immediate feedback
      setError('Failed to save task. Please try again.');
      console.error('Error saving task in dialog:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{currentTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
      <DialogContent>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
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
          error={!!error && title.trim() === ''}
          helperText={!!error && title.trim() === '' ? 'Task title is required.' : ''}
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
        <Button onClick={onClose} disabled={isSaving}>Cancel</Button>
        <Button onClick={handleLocalSave} disabled={isSaving} variant="contained" color="primary">
          {isSaving ? 'Saving...' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskFormDialog;