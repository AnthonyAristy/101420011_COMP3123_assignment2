import React, { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Grid,
  Alert,
  Snackbar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API from "../api";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    department: "",
    salary: "",
    date_of_joining: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const navigate = useNavigate();

  const validateForm = () => {
    const errors = {};
    const validators = {
      first_name: {
        required: "First Name is required.",
        pattern: /^[A-Za-z\s]+$/,
        message: "First Name can only contain letters.",
      },
      last_name: {
        required: "Last Name is required.",
        pattern: /^[A-Za-z\s]+$/,
        message: "Last Name can only contain letters.",
      },
      email: {
        required: "Email is required.",
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "Invalid email format.",
      },
      position: {
        required: "Position is required.",
        pattern: /^[A-Za-z0-9\s]+$/,
        message: "Position can only contain letters and numbers.",
      },
      department: {
        required: "Department is required.",
        pattern: /^[A-Za-z0-9\s]+$/,
        message: "Department can only contain letters and numbers.",
      },
      salary: {
        required: "Salary is required.",
        pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
        message: "Salary must be a numeric value.",
      },
      date_of_joining: {
        required: "Date of Joining is required.",
        pattern: (value) => !isNaN(Date.parse(value)),
        message: "Invalid date format.",
      },
    };

    for (const [key, { required, pattern, message }] of Object.entries(
      validators
    )) {
      if (!formData[key]?.trim()) {
        errors[key] = required;
      } else if (
        typeof pattern === "function"
          ? !pattern(formData[key])
          : !pattern.test(formData[key])
      ) {
        errors[key] = message;
      }
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await API.post("/employees", formData);
      setMessage("Employee added successfully!");
      setMessageType("success");
      setTimeout(() => navigate("/employees"), 2000);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "Error adding employee.";
      setMessage(errorMsg);
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
        background:
          "linear-gradient(135deg, #e8f5e9 0%, #ffffff 50%, #c8e6c9 100%)",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 800, width: "100%", p: 4, borderRadius: 4 }}>
        <Typography
          variant="h4"
          align="center"
          sx={{ mb: 2, color: "#43a047", fontWeight: "bold" }}
        >
          Add Employee
        </Typography>

        {message && (
          <Snackbar
            open={!!message}
            autoHideDuration={4000}
            onClose={() => setMessage(null)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert severity={messageType} onClose={() => setMessage(null)}>
              {message}
            </Alert>
          </Snackbar>
        )}

        <CardContent>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "First Name", value: "first_name" },
                { label: "Last Name", value: "last_name" },
                { label: "Email", value: "email", type: "email" },
                { label: "Position", value: "position" },
                { label: "Department", value: "department" },
                { label: "Salary", value: "salary", type: "number" },
                {
                  label: "Date of Joining",
                  value: "date_of_joining",
                  type: "date",
                },
              ].map(({ label, value, type = "text" }) => (
                <Grid item xs={12} sm={6} key={value}>
                  <TextField
                    label={label}
                    fullWidth
                    type={type}
                    value={formData[value]}
                    onChange={(e) =>
                      setFormData({ ...formData, [value]: e.target.value })
                    }
                    error={!!errors[value]}
                    helperText={errors[value]}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: "#43a047" },
                        "&:hover fieldset": { borderColor: "#2e7d32" },
                      },
                      "& .MuiInputLabel-root": { color: "#43a047" },
                      "& .MuiInputLabel-root.Mui-focused": { color: "#2e7d32" },
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            <Box
              sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#43a047",
                  "&:hover": { backgroundColor: "#2e7d32" },
                }}
              >
                Save
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#2e7d32",
                  borderColor: "#2e7d32",
                  "&:hover": { backgroundColor: "#e8f5e9" },
                }}
                onClick={() => navigate("/employees")}
              >
                Cancel
              </Button>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AddEmployee;
