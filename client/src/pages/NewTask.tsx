import React from 'react';
import { Box, Typography } from '@mui/material';

const NewTask: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Create New Task
      </Typography>
      <Typography variant="body1">
        This is where you will create a new task.
      </Typography>
      {/* Your new task form will go here */}
    </Box>
  );
};

export default NewTask; // <--- THIS IS THE CRUCIAL LINE