import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const UpdateEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    position: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await API.get(`/employees/${id}`);
        setFormData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching employee data:", error);
        setMessage({
          type: "error",
          text: "Error fetching employee data.",
        });
        setLoading(false);
      }
    };
    fetchEmployee();
  }, [id]);

  const validateForm = () => {
    const errors = {};
    const nameRegex = /^[A-Za-z\s]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const textRegex = /^[A-Za-z0-9\s]+$/;

    if (!formData.first_name.trim()) {
      errors.first_name = "First Name is required.";
    } else if (!nameRegex.test(formData.first_name)) {
      errors.first_name = "First Name can only contain letters.";
    }

    if (!formData.last_name.trim()) {
      errors.last_name = "Last Name is required.";
    } else if (!nameRegex.test(formData.last_name)) {
      errors.last_name = "Last Name can only contain letters.";
    }

    if (!formData.email.trim()) {
      errors.email = "Email is required.";
    } else if (!emailRegex.test(formData.email)) {
      errors.email = "Invalid email format.";
    }

    if (!formData.position.trim()) {
      errors.position = "Position is required.";
    } else if (!textRegex.test(formData.position)) {
      errors.position = "Position can only contain letters and numbers.";
    }

    if (!formData.department.trim()) {
      errors.department = "Department is required.";
    } else if (!textRegex.test(formData.department)) {
      errors.department = "Department can only contain letters and numbers.";
    }

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await API.put(`/employees/${id}`, formData);
      setMessage({
        type: "success",
        text: "Employee updated successfully!",
      });
      setTimeout(() => navigate("/employees"), 2000);
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error updating employee.";
      console.error("Error updating employee:", errorMessage);
      setMessage({ type: "error", text: errorMessage });
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#e8f5e9",
          backgroundImage:
            "linear-gradient(135deg, #e8f5e9 0%, #ffffff 50%, #c8e6c9 100%)",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#e8f5e9",
        backgroundImage:
          "linear-gradient(135deg, #e8f5e9 0%, #ffffff 50%, #c8e6c9 100%)",
        px: 2,
      }}
    >
      <Card sx={{ maxWidth: 800, width: "100%", p: 4, borderRadius: 4 }}>
        <CardContent>
          <Typography
            variant="h4"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#43a047", mb: 3 }}
          >
            Update Employee
          </Typography>

          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              {[
                { label: "First Name", value: "first_name" },
                { label: "Last Name", value: "last_name" },
                { label: "Email", value: "email", type: "email" },
                { label: "Position", value: "position" },
                { label: "Department", value: "department" },
              ].map(({ label, value, type = "text" }) => (
                <React.Fragment key={value}>
                  <Grid item xs={12} sm={4} display="flex" alignItems="center">
                    <Typography
                      sx={{
                        fontWeight: "bold",
                        color: "#43a047",
                      }}
                    >
                      {label}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={8}>
                    <TextField
                      fullWidth
                      type={type}
                      value={formData[value] || ""}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          [value]: e.target.value,
                        }))
                      }
                      error={!!errors[value]}
                      helperText={errors[value]}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": {
                            borderColor: "#43a047",
                          },
                          "&:hover fieldset": {
                            borderColor: "#2e7d32",
                          },
                        },
                        "& .MuiInputLabel-root": {
                          color: "#43a047",
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                          color: "#2e7d32",
                        },
                      }}
                    />
                  </Grid>
                </React.Fragment>
              ))}
            </Grid>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mt: 3,
              }}
            >
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#43a047",
                  "&:hover": { backgroundColor: "#2e7d32" },
                }}
              >
                Update
              </Button>
              <Button
                variant="outlined"
                sx={{
                  color: "#2e7d32",
                  borderColor: "#2e7d32",
                  "&:hover": {
                    backgroundColor: "#e8f5e9",
                  },
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

export default UpdateEmployee;
