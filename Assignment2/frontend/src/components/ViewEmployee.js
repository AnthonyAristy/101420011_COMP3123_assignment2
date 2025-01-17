import React, { useState, useEffect } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Alert,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import { FaUser, FaEnvelope, FaBriefcase, FaBuilding } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api";

const ViewEmployee = () => {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const { data } = await API.get(`/employees/${id}`);
        setEmployee(data);
        setError(false);
      } catch (err) {
        console.error("Error fetching employee data:", err);
        setError(true);
      }
    };
    fetchEmployee();
  }, [id]);

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "#f4f6f8",
        }}
      >
        <Alert severity="error" sx={{ mb: 3 }}>
          Failed to load employee details. Please try again.
        </Alert>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#43a047",
            "&:hover": { backgroundColor: "#2e7d32" },
          }}
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!employee) {
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
      <Card sx={{ maxWidth: 500, width: "100%", p: 3, borderRadius: 4 }}>
        <CardContent>
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#43a047" }}
          >
            Employee Details
          </Typography>

          <List>
            {[
              {
                label: "First Name",
                value: employee.first_name,
                icon: <FaUser />,
              },
              {
                label: "Last Name",
                value: employee.last_name,
                icon: <FaUser />,
              },
              { label: "Email", value: employee.email, icon: <FaEnvelope /> },
              {
                label: "Position",
                value: employee.position,
                icon: <FaBriefcase />,
              },
              {
                label: "Department",
                value: employee.department,
                icon: <FaBuilding />,
              },
            ].map(({ label, value, icon }, index) => (
              <ListItem key={index} sx={{ px: 0 }}>
                <ListItemIcon sx={{ color: "#43a047", minWidth: 36 }}>
                  {icon}
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                      {label}
                    </Typography>
                  }
                  secondary={
                    <Typography variant="body2" color="textSecondary">
                      {value}
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              backgroundColor: "#43a047",
              "&:hover": { backgroundColor: "#2e7d32" },
            }}
            onClick={() => navigate("/employees")}
          >
            Back to Employee List
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ViewEmployee;
