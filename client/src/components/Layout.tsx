import React from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import { Box } from "@mui/material";

const Layout: React.FC = () => {
  return (
    <Box>
      <Header />
      <Box component="main" sx={{ p: 3 }}>
        <Outlet />{" "}
      </Box>
    </Box>
  );
};

export default Layout;
