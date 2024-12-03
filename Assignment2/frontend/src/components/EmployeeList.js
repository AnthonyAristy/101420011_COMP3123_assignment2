import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Snackbar,
  Alert,
  CircularProgress,
  IconButton,
  Box,
  Pagination,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Preview,
  ModeEdit,
  DeleteForever,
  AccountCircle,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import API from "../api";

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [searchDepartment, setSearchDepartment] = useState("");
  const [searchPosition, setSearchPosition] = useState("");
  const [message, setMessage] = useState(null);
  const [messageType, setMessageType] = useState("success");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/employees");
        setEmployees(data);
      } catch {
        setMessage("Error fetching employees.");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleSearch = async () => {
    if (!searchDepartment.trim() && !searchPosition.trim()) {
      setMessage("Please provide at least one search filter.");
      setMessageType("warning");
      return;
    }

    const query = new URLSearchParams();
    if (searchDepartment) query.append("department", searchDepartment);
    if (searchPosition) query.append("position", searchPosition);

    setLoading(true);
    try {
      const { data } = await API.get(`/employees/search?${query.toString()}`);
      setEmployees(data);
      if (data.length === 0) {
        setMessage("No employees found matching the search criteria.");
        setMessageType("info");
      }
    } catch {
      setMessage("Error searching employees.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id) => {
    setLoading(true);
    try {
      await API.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((employee) => employee._id !== id));
      setMessage("Employee deleted successfully.");
      setMessageType("success");
    } catch {
      setMessage("Error deleting employee.");
      setMessageType("error");
    } finally {
      setLoading(false);
      setDialogOpen(false);
    }
  };

  const paginatedEmployees = employees.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #e8f5e9 0%, #ffffff 50%, #c8e6c9 100%)",
        px: 2,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppBar position="static" sx={{ backgroundColor: "#43a047" }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Employee Portal
          </Typography>
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            sx={{ color: "white" }}
          >
            <AccountCircle fontSize="large" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={handleLogout}>Log Out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Snackbar
          open={!!message}
          autoHideDuration={4000}
          onClose={() => setMessage(null)}
        >
          <Alert severity={messageType}>{message}</Alert>
        </Snackbar>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Search by Department"
            value={searchDepartment}
            onChange={(e) => setSearchDepartment(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              "& fieldset": { borderColor: "#43a047" },
              "&:hover fieldset": { borderColor: "#2e7d32" },
            }}
          />
          <TextField
            label="Search by Position"
            value={searchPosition}
            onChange={(e) => setSearchPosition(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              "& fieldset": { borderColor: "#43a047" },
              "&:hover fieldset": { borderColor: "#2e7d32" },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={loading}
            sx={{
              backgroundColor: "#43a047",
              "&:hover": { backgroundColor: "#2e7d32" },
            }}
          >
            {loading ? <CircularProgress size={24} /> : "Search"}
          </Button>
        </Box>

        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/add-employee")}
          sx={{ mb: 3 }}
        >
          Add Employee
        </Button>

        {loading ? (
          <CircularProgress />
        ) : (
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  {["Name", "Email", "Position", "Department", "Actions"].map(
                    (header) => (
                      <TableCell key={header}>
                        <strong>{header}</strong>
                      </TableCell>
                    )
                  )}
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedEmployees.map((employee) => (
                  <TableRow key={employee._id}>
                    <TableCell>
                      {employee.first_name} {employee.last_name}
                    </TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.position}</TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(`/view-employee/${employee._id}`)
                        }
                      >
                        <Preview />
                      </IconButton>
                      <IconButton
                        color="warning"
                        onClick={() =>
                          navigate(`/update-employee/${employee._id}`)
                        }
                      >
                        <ModeEdit />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => {
                          setSelectedEmployee(employee);
                          setDialogOpen(true);
                        }}
                      >
                        <DeleteForever />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {employees.length > pageSize && (
          <Pagination
            count={Math.ceil(employees.length / pageSize)}
            page={page}
            onChange={(e, value) => setPage(value)}
            sx={{ mt: 3, display: "flex", justifyContent: "center" }}
          />
        )}

        <Dialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          sx={{ textAlign: "center" }}
        >
          <DialogTitle>Confirm Deletion</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to delete{" "}
              <strong>
                {selectedEmployee?.first_name} {selectedEmployee?.last_name}
              </strong>
              ? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              variant="outlined"
              onClick={() => setDialogOpen(false)}
              sx={{ borderColor: "#2e7d32", color: "#2e7d32" }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={() => handleDeleteEmployee(selectedEmployee._id)}
              sx={{
                backgroundColor: "#43a047",
                "&:hover": { backgroundColor: "#2e7d32" },
              }}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EmployeeList;
