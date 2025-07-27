import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
// import './index.css';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { AuthProvider } from "./context/AuthContext.tsx"; // Import AuthProvider


const theme = createTheme({
  palette: {
    primary: {
      main: "#4CAF50", // A nice green color
    },
    secondary: {
      main: "#FFC107", // A warm yellow
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
  },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        {" "}
        
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
);
