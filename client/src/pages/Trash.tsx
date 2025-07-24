import React from 'react';
import { Box, Typography } from '@mui/material';

const Trash: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trashed Tasks
      </Typography>
      <Typography variant="body1">
        This is where your deleted tasks will be displayed.
      </Typography>
      {/* Trashed tasks list will go here */}
    </Box>
  );
};

export default Trash;