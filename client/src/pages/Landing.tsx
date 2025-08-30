import {
  Box,
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Avatar,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import { CheckCircle, Star } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Landing() {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && comment.trim()) {
      
      console.log("Feedback recorded:", { name, comment });
      setSuccess(true);
      setName("");
      setComment("");
    }
  };

  return (
    <Box>
      
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2 }}
      >
        <Box
          sx={{
            height: "90vh",
            backgroundImage: "linear-gradient(rgba(245, 247, 250, 0.85), rgba(230, 235, 243, 0.85)), url('/background-image.jpg')",
            display: "flex",
             alignItems: "center",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <Container maxWidth="lg">
            <Grid container spacing={6} alignItems="center">
              
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                >
                  <Typography variant="h3" fontWeight="bold" gutterBottom>
                    Organize Your Life Effortlessly
                  </Typography>
                  <Typography variant="h6" sx={{ mb: 4 }}>
                    Manage tasks, stay productive, and achieve your goals with
                    ease using TaskY.
                  </Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    size="large"
                    sx={{ mr: 2, borderRadius: 3 }}
                    component={RouterLink}
                    to="/register"
                  >
                    Get Started
                  </Button>
                  <Button
                    variant="outlined"
                    color="inherit"
                    size="large"
                    sx={{ borderRadius: 3 }}
                    component="a"
                    href="https://linear.app"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn More
                  </Button>
                </motion.div>
              </Grid>

             
              <Grid item xs={12} md={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <Box
                    sx={{
                      width: "100%",
                      height: "100%",
                      borderRadius: 3,
                      bgcolor: "white",
                      boxShadow: 5,
                      p: 3,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      height="250"
                      viewBox="0 0 600 400"
                    >
                      <rect width="600" height="400" rx="20" fill="#f4f6f8" />
                      <rect
                        x="50"
                        y="60"
                        width="500"
                        height="40"
                        rx="8"
                        fill="#1976d2"
                      />
                      <rect
                        x="50"
                        y="120"
                        width="400"
                        height="30"
                        rx="6"
                        fill="#90caf9"
                      />
                      <rect
                        x="50"
                        y="170"
                        width="300"
                        height="30"
                        rx="6"
                        fill="#90caf9"
                      />
                      <circle cx="100" cy="270" r="40" fill="#1976d2" />
                      <circle cx="250" cy="270" r="40" fill="#42a5f5" />
                      <circle cx="400" cy="270" r="40" fill="#64b5f6" />
                    </svg>
                  </Box>
                </motion.div>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </motion.div>

     
      <Container sx={{ py: 12 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
            Why Choose TaskY?
          </Typography>
          <Grid container spacing={4} sx={{ mt: 6 }}>
            {[
              "Intuitive task management",
              "Secure cloud sync",
              "Cross-device support",
              "Collaborate with teams",
            ].map((feature, index) => (
              <Grid key={index} item xs={12} sm={6} md={3}>
                <Card
                  sx={{
                    textAlign: "center",
                    p: 4,
                    borderRadius: 4,
                    height: "100%",
                    boxShadow: 4,
                    transition: "0.3s",
                    "&:hover": {
                      transform: "translateY(-6px)",
                      boxShadow: 6,
                    },
                  }}
                >
                  <CheckCircle color="primary" fontSize="large" />
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {feature}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      
      <Box sx={{ bgcolor: "grey.100", py: 12 }}>
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <Typography
              variant="h4"
              fontWeight="bold"
              align="center"
              gutterBottom
            >
              Loved by Our Users
            </Typography>
            <Grid container spacing={4} sx={{ mt: 6 }}>
              {[
                {
                  name: "Jane Doe",
                  feedback:
                    "TaskY has transformed the way I work. It's simple and effective!",
                },
                {
                  name: "Michael Smith",
                  feedback:
                    "I love how I can sync tasks across devices. Total game-changer!",
                },
                {
                  name: "Sophia Lee",
                  feedback:
                    "Collaboration features make team projects so much easier.",
                },
              ].map((user, index) => (
                <Grid key={index} item xs={12} md={4}>
                  <Card
                    sx={{
                      p: 4,
                      borderRadius: 4,
                      height: "100%",
                      boxShadow: 3,
                      transition: "0.3s",
                      "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                    }}
                  >
                    <CardContent sx={{ textAlign: "center" }}>
                      <Avatar
                        sx={{ mx: "auto", mb: 2, bgcolor: "primary.main" }}
                      >
                        {user.name.charAt(0)}
                      </Avatar>
                      <Typography variant="body1" gutterBottom>
                        "{user.feedback}"
                      </Typography>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {user.name}
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Star color="warning" fontSize="small" />
                        <Star color="warning" fontSize="small" />
                        <Star color="warning" fontSize="small" />
                        <Star color="warning" fontSize="small" />
                        <Star color="warning" fontSize="small" />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            
            <Box
              sx={{
                mt: 8,
                p: 4,
                borderRadius: 4,
                bgcolor: "white",
                boxShadow: 3,
                maxWidth: 600,
                mx: "auto",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                align="center"
                gutterBottom
              >
                Share Your Feedback
              </Typography>
              <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                <TextField
                  fullWidth
                  label="Your Name"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Your Comment"
                  variant="outlined"
                  sx={{ mb: 2 }}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  sx={{ borderRadius: 3, py: 1.2 }}
                >
                  Submit Feedback
                </Button>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>

      
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Feedback recorded successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
}
