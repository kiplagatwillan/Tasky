import React from 'react';
import { Box, Typography } from '@mui/material';

const CompletedTasks: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Completed Tasks
      </Typography>
      <Typography variant="body1">
        This is where your completed tasks will be displayed.
      </Typography>
      {/* Completed tasks list will go here */}
    </Box>
  );
};

export default CompletedTasks;