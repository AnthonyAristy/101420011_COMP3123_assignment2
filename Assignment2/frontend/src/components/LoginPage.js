import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Alert,
  Snackbar,
} from "@mui/material";
import { FaLock, FaEnvelope } from "react-icons/fa";
import API from "../api";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem("token", data.token);
      setMessage(data.message);
      setMessageType("success");
      setTimeout(() => (window.location.href = "/employees"), 1000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.errors?.map((err) => err.msg).join("\n") ||
        "An error occurred. Please try again.";
      setMessage(errorMessage);
      setMessageType("error");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#e8f5e9",
        px: 2,
        backgroundImage:
          "linear-gradient(135deg, #e8f5e9 0%, #ffffff 50%, #c8e6c9 100%)",
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: "100%",
          p: 3,
          borderRadius: 4,
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.15)",
          backgroundColor: "#ffffff",
        }}
      >
        <Typography
          variant="h5"
          align="center"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#43a047",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Welcome Back
        </Typography>
        <Typography
          variant="body2"
          align="center"
          gutterBottom
          sx={{ color: "#4caf50", mb: 3 }}
        >
          Login to access your account
        </Typography>

        {message && (
          <Snackbar
            open={!!message}
            autoHideDuration={4000}
            onClose={() => setMessage(null)}
          >
            <Alert
              severity={messageType === "success" ? "success" : "error"}
              onClose={() => setMessage(null)}
            >
              {message}
            </Alert>
          </Snackbar>
        )}

        <CardContent>
          <form onSubmit={handleLogin}>
            <TextField
              fullWidth
              variant="outlined"
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#43a047",
                  },
                  "&:hover fieldset": {
                    borderColor: "#2e7d32",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ color: "#43a047", mr: 1 }}>
                    <FaEnvelope />
                  </Box>
                ),
              }}
              required
            />
            <TextField
              fullWidth
              variant="outlined"
              label="Password"
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  "& fieldset": {
                    borderColor: "#43a047",
                  },
                  "&:hover fieldset": {
                    borderColor: "#2e7d32",
                  },
                },
              }}
              InputProps={{
                startAdornment: (
                  <Box component="span" sx={{ color: "#43a047", mr: 1 }}>
                    <FaLock />
                  </Box>
                ),
              }}
              required
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                mt: 1,
                backgroundColor: "#43a047",
                color: "#ffffff",
                fontWeight: "bold",
                textTransform: "uppercase",
                "&:hover": {
                  backgroundColor: "#2e7d32",
                },
              }}
            >
              Login
            </Button>
          </form>
        </CardContent>

        <CardActions
          sx={{
            justifyContent: "center",
            flexDirection: "column",
            mt: 2,
          }}
        >
          <Typography variant="body2" align="center">
            New here?{" "}
            <Box
              component="span"
              sx={{
                cursor: "pointer",
                color: "#43a047",
                fontWeight: "bold",
                textDecoration: "underline",
                "&:hover": {
                  color: "#2e7d32",
                },
              }}
              onClick={() => (window.location.href = "/signup")}
            >
              Sign up
            </Box>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default LoginPage;
