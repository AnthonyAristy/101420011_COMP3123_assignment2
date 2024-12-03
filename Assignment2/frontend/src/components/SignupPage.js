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
import { FaUser, FaLock, FaEnvelope } from "react-icons/fa";
import API from "../api";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post("/auth/signup", formData);
      setMessage(response.data.message || "Signup successful!");
      setMessageType("success");
      setTimeout(() => (window.location.href = "/login"), 1000);
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
        }}
      >
        <Typography
          variant="h5"
          align="center"
          sx={{
            fontWeight: "bold",
            color: "#43a047",
            textTransform: "uppercase",
            mb: 1,
          }}
        >
          Create Account
        </Typography>
        <Typography
          variant="body2"
          align="center"
          sx={{ color: "#4caf50", mb: 3 }}
        >
          Join us and start your journey
        </Typography>

        {message && (
          <Snackbar
            open={!!message}
            autoHideDuration={4000}
            onClose={() => setMessage(null)}
          >
            <Alert severity={messageType} onClose={() => setMessage(null)}>
              {message}
            </Alert>
          </Snackbar>
        )}

        <CardContent>
          <form onSubmit={handleSignup}>
            {[
              {
                label: "Username",
                value: formData.username,
                onChange: (e) =>
                  setFormData({ ...formData, username: e.target.value }),
                icon: <FaUser />,
              },
              {
                label: "Email",
                value: formData.email,
                type: "email",
                onChange: (e) =>
                  setFormData({ ...formData, email: e.target.value }),
                icon: <FaEnvelope />,
              },
              {
                label: "Password",
                value: formData.password,
                type: "password",
                onChange: (e) =>
                  setFormData({ ...formData, password: e.target.value }),
                icon: <FaLock />,
              },
            ].map(({ label, value, onChange, type = "text", icon }) => (
              <TextField
                key={label}
                fullWidth
                variant="outlined"
                label={label}
                type={type}
                value={value}
                onChange={onChange}
                sx={{
                  mb: 2,
                  "& .MuiOutlinedInput-root:hover fieldset": {
                    borderColor: "#2e7d32",
                  },
                  "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                    borderColor: "#43a047",
                  },
                }}
                InputProps={{
                  startAdornment: (
                    <Box component="span" sx={{ color: "#43a047", mr: 1 }}>
                      {icon}
                    </Box>
                  ),
                }}
                required
              />
            ))}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{
                py: 1.5,
                mt: 1,
                backgroundColor: "#43a047",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#2e7d32" },
              }}
            >
              Sign Up
            </Button>
          </form>
        </CardContent>

        <CardActions sx={{ justifyContent: "center", mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Box
              component="span"
              sx={{
                cursor: "pointer",
                color: "#43a047",
                fontWeight: "bold",
                textDecoration: "underline",
                "&:hover": { color: "#2e7d32" },
              }}
              onClick={() => (window.location.href = "/login")}
            >
              Log in
            </Box>
          </Typography>
        </CardActions>
      </Card>
    </Box>
  );
};

export default SignupPage;
