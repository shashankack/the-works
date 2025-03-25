import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Paper,
  Typography,
  IconButton,
  DialogContentText,
  LinearProgress,
} from "@mui/material";
import { Add, Edit, Delete } from "@mui/icons-material";
import axiosInstance from "../../utils/axiosInstance";

const Trainers = () => {
  const [trainers, setTrainers] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [trainerToDelete, setTrainerToDelete] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
  });

  const fetchTrainers = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/trainers");
      if (res.data.success) {
        setTrainers(res.data.trainers);
      }
    } catch (error) {
      setAlert({ message: "Failed to load trainers.", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrainers();
  }, []);

  const handleOpenForm = (trainer) => {
    setEditingTrainer(trainer || null);
    setFormData({
      name: trainer?.name || "",
      email: trainer?.email || "",
      phone: trainer?.phone || "",
      specialization: trainer?.specialization || "",
    });
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setEditingTrainer(null);
    setFormData({ name: "", email: "", phone: "", specialization: "" });
  };

  const handleFormSubmit = async () => {
    const { name, email, phone, specialization } = formData;

    if (!name || !email || !specialization) {
      setAlert({
        message: "Name, Email, and Specialization are required.",
        severity: "error",
      });
      return;
    }

    setLoading(true);

    try {
      if (editingTrainer) {
        await axiosInstance.put(
          `/admin/trainers/${editingTrainer.id}`,
          formData
        );
        setAlert({ message: "Trainer updated.", severity: "success" });
      } else {
        await axiosInstance.post("/admin/trainers", formData);
        setAlert({ message: "Trainer created.", severity: "success" });
      }

      handleCloseForm();
      fetchTrainers();
    } catch (error) {
      console.error(error);
      setAlert({
        message: error?.response?.data?.message || "Failed to save trainer.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDelete = (trainer) => {
    setTrainerToDelete(trainer);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setLoading(true);
    try {
      if (trainerToDelete) {
        await axiosInstance.delete(`/admin/trainers/${trainerToDelete.id}`);
        setAlert({
          message: `${trainerToDelete.name} deleted successfully.`,
          severity: "success",
        });
        fetchTrainers();
      }
    } catch (error) {
      console.error(error);
      setAlert({ message: "Failed to delete trainer.", severity: "error" });
    } finally {
      setLoading(false);
      setDeleteDialogOpen(false);
      setTrainerToDelete(null);
    }
  };

  return (
    <Box p={4}>
      {loading && <LinearProgress />}

      <Typography variant="h4" gutterBottom>
        Trainers
      </Typography>

      <Button
        variant="contained"
        startIcon={<Add />}
        onClick={() => handleOpenForm()}
        sx={{ mb: 2 }}
      >
        Create Trainer
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Specialization</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {trainers.map((trainer) => (
              <TableRow key={trainer.id}>
                <TableCell>{trainer.name}</TableCell>
                <TableCell>{trainer.email}</TableCell>
                <TableCell>{trainer.phone}</TableCell>
                <TableCell>{trainer.specialization}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleOpenForm(trainer)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleOpenDelete(trainer)}>
                    <Delete color="error" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {trainers.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No trainers found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Create / Edit Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm}>
        <DialogTitle>
          {editingTrainer ? "Edit Trainer" : "Create Trainer"}
        </DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            fullWidth
            margin="dense"
          />
          <TextField
            label="Email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            fullWidth
            margin="dense"
          />
          <TextField
            label="Specialization"
            value={formData.specialization}
            onChange={(e) =>
              setFormData({ ...formData, specialization: e.target.value })
            }
            fullWidth
            margin="dense"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm}>Cancel</Button>
          <Button
            onClick={handleFormSubmit}
            variant="contained"
            disabled={loading}
          >
            {editingTrainer ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{trainerToDelete?.name}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={!!alert}
        autoHideDuration={3000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={() => setAlert(null)}
          severity={alert?.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Trainers;
