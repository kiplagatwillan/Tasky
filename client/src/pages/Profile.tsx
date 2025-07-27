import React from "react";
import { Box, Typography } from "@mui/material";

const Profile: React.FC = () => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Profile
      </Typography>
      <Typography variant="body1">
        This is where you will manage your profile settings.
      </Typography>
      {/* User profile form/details will go here */}
    </Box>
  );
};

export default Profile;
