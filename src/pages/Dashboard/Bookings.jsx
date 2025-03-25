import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TextField,
  TableRow,
  Typography,
  Paper,
} from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    bookingId: null,
    action: null,
  });

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axiosInstance.get("/admin/bookings", {
        params: filterStatus ? { status: filterStatus } : {},
      });
      setBookings(res.data);
    } catch (err) {
      setAlert({ message: "Failed to fetch bookings", severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const handleAction = async () => {
    const { bookingId, action } = confirmDialog;
    if (!bookingId || !action) return;

    setLoading(true);
    try {
      const res = await axiosInstance.post(
        `/admin/bookings/${action}/${bookingId}`
      );
      setAlert({ message: res.data.message, severity: "success" });
      fetchBookings();
    } catch (err) {
      setAlert({ message: "Failed to update booking", severity: "error" });
    } finally {
      setConfirmDialog({ open: false, bookingId: null, action: null });
      setLoading(false);
    }
  };

  const getColor = (status) => {
    switch (status) {
      case "PENDING":
        return "warning";
      case "CONFIRMED":
        return "success";
      case "CANCELLED":
        return "error";
      default:
        return "default";
    }
  };

  return (
    <Box p={4}>
      {loading && <LinearProgress />}

      <Typography variant="h4" gutterBottom>
        Bookings
      </Typography>

      <Box
        display="flex"
        flexWrap="wrap"
        gap={2}
        alignItems="center"
        justifyContent="space-between"
        mb={2}
      >
        <Select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          displayEmpty
          size="small"
        >
          <MenuItem value="">All Statuses</MenuItem>
          <MenuItem value="PENDING">Pending</MenuItem>
          <MenuItem value="CONFIRMED">Confirmed</MenuItem>
          <MenuItem value="CANCELLED">Cancelled</MenuItem>
        </Select>

        <Select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          displayEmpty
          size="small"
        >
          <MenuItem value="all">All Types</MenuItem>
          <MenuItem value="class">Class Bookings</MenuItem>
          <MenuItem value="event">Event Bookings</MenuItem>
        </Select>

        <TextField
          size="small"
          placeholder="Search by user name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Class</TableCell>
              <TableCell>Event</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings
              .filter((booking) => {
                if (filterType === "class") return booking.class;
                if (filterType === "event") return booking.event;
                return true;
              })
              .filter((booking) =>
                booking.user?.name
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase())
              )
              .map((booking) => (
                <TableRow key={booking.id}>
                  <TableCell>{booking.user?.name || "Unknown"}</TableCell>
                  <TableCell>
                    {booking.class ? booking.class.title : "N/A"}
                  </TableCell>
                  <TableCell>
                    {booking.event ? booking.event.title : "N/A"}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={booking.bookingStatus}
                      color={getColor(booking.bookingStatus)}
                    />
                  </TableCell>
                  <TableCell align="right">
                    {booking.bookingStatus === "PENDING" && (
                      <>
                        <Button
                          color="success"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              bookingId: booking.id,
                              action: "confirm",
                            })
                          }
                        >
                          Confirm
                        </Button>
                        <Button
                          color="error"
                          onClick={() =>
                            setConfirmDialog({
                              open: true,
                              bookingId: booking.id,
                              action: "cancel",
                            })
                          }
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                  </TableCell>
                </TableRow>
              ))}

            {bookings.length === 0 && !loading && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No bookings found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirm / Cancel Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ open: false })}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            <strong>
              {confirmDialog.action === "confirm" ? "confirm" : "cancel"}
            </strong>{" "}
            this booking?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialog({ open: false })}>
            Cancel
          </Button>
          <Button
            variant="contained"
            color={confirmDialog.action === "confirm" ? "success" : "error"}
            onClick={handleAction}
          >
            {confirmDialog.action === "confirm" ? "Confirm" : "Cancel"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alerts */}
      <Snackbar
        open={!!alert}
        autoHideDuration={3000}
        onClose={() => setAlert(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={alert?.severity}
          variant="filled"
          onClose={() => setAlert(null)}
          sx={{ width: "100%" }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Bookings;
