import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Collapse,
  IconButton,
  LinearProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Snackbar,
  Alert,
  useTheme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import DeleteIcon from "@mui/icons-material/Delete";
import axiosInstance from "../../utils/axiosInstance";

const Bookings = () => {
  const theme = useTheme();
  const [eventsData, setEventsData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    bookingId: null,
    action: null,
    title: "",
  });
  const [savingText, setSavingText] = useState("");
  const [alert, setAlert] = useState(null);

  // Fetch both events and classes data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [eventsRes, classesRes] = await Promise.all([
          axiosInstance.get("/admin/bookings/events/with-bookings"),
          axiosInstance.get("/admin/bookings/classes/with-bookings"),
        ]);
        setEventsData(eventsRes.data);
        setClassesData(classesRes.data);
      } catch (error) {
        setAlert({ message: "Failed to fetch data", severity: "error" });
        setEventsData([]);
        setClassesData([]);
      }
      setLoading(false);
      setExpandedId(null);
    };
    fetchData();
  }, []);

  const toggleExpand = (id, type) => {
    setExpandedId(expandedId === `${type}-${id}` ? null : `${type}-${id}`);
  };

  const getStatusColor = (status) => {
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

  const handleAction = async () => {
    const { bookingId, action } = confirmDialog;
    if (!bookingId || !action) return;

    setSavingText(
      action === "confirm"
        ? "Sending Confirmation Mail"
        : action === "cancel"
        ? "Sending Cancellation Mail"
        : "Deleting Booking"
    );
    setLoading(true);
    try {
      let res;
      if (action === "delete") {
        res = await axiosInstance.delete(`/admin/bookings/${bookingId}`);
      } else {
        res = await axiosInstance.post(
          `/admin/bookings/${action}/${bookingId}`
        );
      }

      setAlert({ message: res.data.message, severity: "success" });

      // Refresh both events and classes data
      const [eventsRes, classesRes] = await Promise.all([
        axiosInstance.get("/admin/bookings/events/with-bookings"),
        axiosInstance.get("/admin/bookings/classes/with-bookings"),
      ]);
      setEventsData(eventsRes.data);
      setClassesData(classesRes.data);
    } catch (err) {
      setAlert({
        message: err.response?.data?.error || "Failed to process booking",
        severity: "error",
      });
    } finally {
      setConfirmDialog({
        open: false,
        bookingId: null,
        action: null,
        title: "",
      });
      setSavingText("");
      setLoading(false);
    }
  };

  const renderItemTable = (item, type) => {
    const bookings = item.bookings || [];
    const idKey = type === "event" ? "eventId" : "classId";
    const titleKey = type === "event" ? "eventTitle" : "classTitle";

    return (
      <Paper
        key={`${type}-${item[idKey]}`}
        sx={{
          mb: 4,
          p: 3,
          backgroundColor: theme.palette.beige,
          border: `1px solid ${theme.palette.brown}`,
        }}
      >
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          onClick={() => toggleExpand(item[idKey], type)}
          sx={{ cursor: "pointer" }}
        >
          <Box display="flex" alignItems="center" gap={2}>
            <Typography variant="h6" color={theme.palette.brown}>
              {item[titleKey]}
            </Typography>
            {/* Show count of users registered */}
            <Chip
              label={`${bookings.length} Registered`}
              sx={{
                backgroundColor: theme.palette.orange,
                color: theme.palette.beige,
                fontWeight: "bold",
              }}
            />
            <Chip
              label={type.toUpperCase()}
              sx={{
                backgroundColor: theme.palette.orange,
                color: theme.palette.beige,
              }}
            />
            {item.eventStatus && (
              <Chip
                label={item.eventStatus}
                sx={{
                  border: `1px solid ${theme.palette.orange}`,
                  backgroundColor: "transparent",
                  color: theme.palette.orange,
                }}
              />
            )}
          </Box>
          <IconButton>
            {expandedId === `${type}-${item[idKey]}` ? (
              <ExpandLessIcon color="brown" />
            ) : (
              <ExpandMoreIcon color="brown" />
            )}
          </IconButton>
        </Box>

        <Collapse
          in={expandedId === `${type}-${item[idKey]}`}
          timeout="auto"
          unmountOnExit
        >
          {bookings.length === 0 ? (
            <Typography sx={{ mt: 2 }} color={theme.palette.brown}>
              No bookings found.
            </Typography>
          ) : (
            <Table size="small" sx={{ mt: 2 }}>
              <TableHead>
                <TableRow>
                  <TableCell
                    sx={{ color: theme.palette.brown, fontWeight: "bold" }}
                  >
                    Name
                  </TableCell>
                  <TableCell
                    sx={{ color: theme.palette.brown, fontWeight: "bold" }}
                  >
                    Email
                  </TableCell>
                  <TableCell
                    sx={{ color: theme.palette.brown, fontWeight: "bold" }}
                  >
                    Phone
                  </TableCell>
                  <TableCell
                    sx={{ color: theme.palette.brown, fontWeight: "bold" }}
                  >
                    Status
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{ color: theme.palette.brown, fontWeight: "bold" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {bookings.map((booking) => (
                  <TableRow key={booking.id || booking.userId}>
                    <TableCell sx={{ color: theme.palette.brown }}>
                      {booking.name}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.brown }}>
                      {booking.email}
                    </TableCell>
                    <TableCell sx={{ color: theme.palette.brown }}>
                      {booking.phone}
                    </TableCell>
                    <TableCell>
                      <Chip
                        variant="filled"
                        label={booking.bookingStatus}
                        sx={{
                          backgroundColor:
                            booking.bookingStatus === "PENDING"
                              ? theme.palette.orange
                              : booking.bookingStatus === "CONFIRMED"
                              ? theme.palette.brown
                              : theme.palette.orange,
                          color: theme.palette.beige,
                        }}
                      />
                    </TableCell>
                    <TableCell align="right">
                      <Box display="flex" justifyContent="flex-end" gap={1}>
                        {booking.bookingStatus === "PENDING" && (
                          <>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{
                                color: theme.palette.brown,
                                borderColor: theme.palette.brown,
                                "&:hover": {
                                  backgroundColor: theme.palette.brown,
                                  borderColor: theme.palette.brown,
                                },
                              }}
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  bookingId: booking.id,
                                  action: "confirm",
                                  title: `Confirm booking for ${booking.name}?`,
                                })
                              }
                            >
                              Confirm
                            </Button>
                            <Button
                              size="small"
                              variant="outlined"
                              sx={{
                                color: theme.palette.orange,
                                borderColor: theme.palette.orange,
                                "&:hover": {
                                  backgroundColor: theme.palette.orange,
                                  borderColor: theme.palette.orange,
                                },
                              }}
                              onClick={() =>
                                setConfirmDialog({
                                  open: true,
                                  bookingId: booking.id,
                                  action: "cancel",
                                  title: `Cancel booking for ${booking.name}?`,
                                })
                              }
                            >
                              Cancel
                            </Button>
                          </>
                        )}
                        <IconButton
                          size="small"
                          sx={{
                            color: theme.palette.orange,
                            "&:hover": {
                              color: theme.palette.orange,
                              backgroundColor: theme.palette.orange,
                            },
                          }}
                          onClick={() =>
                            openDeleteDialog(booking.id, booking.name)
                          }
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Collapse>
      </Paper>
    );
  };

  const openDeleteDialog = (bookingId, userName) => {
    setConfirmDialog({
      open: true,
      bookingId,
      action: "delete",
      title: `Delete booking for ${userName}?`,
    });
  };

  return (
    <Box py={8} bgcolor={theme.palette.beige} minHeight="100vh" px={4}>
      {loading && (
        <Box>
          <LinearProgress
            sx={{
              backgroundColor: theme.palette.orange,
              "& .MuiLinearProgress-bar": {
                backgroundColor: theme.palette.brown,
              },
            }}
          />
          {savingText && (
            <Typography
              variant="body2"
              mt={1}
              textAlign="center"
              color={theme.palette.brown}
            >
              {savingText}
            </Typography>
          )}
        </Box>
      )}

      <Typography variant="h4" gutterBottom color={theme.palette.brown}>
        All Bookings
      </Typography>

      {eventsData.length === 0 && classesData.length === 0 && !loading && (
        <Typography color={theme.palette.brown}>No bookings found.</Typography>
      )}

      {/* Events Section */}
      {eventsData.length > 0 && (
        <>
          <Typography variant="h5" gutterBottom color={theme.palette.brown}>
            Events
          </Typography>
          {eventsData.map((event) => renderItemTable(event, "event"))}
        </>
      )}

      {/* Classes Section */}
      {classesData.length > 0 && (
        <>
          <Typography
            variant="h5"
            gutterBottom
            sx={{ mt: 4 }}
            color={theme.palette.brown}
          >
            Classes
          </Typography>
          {classesData.map((cls) => renderItemTable(cls, "class"))}
        </>
      )}

      {/* Confirm Action Dialog */}
      <Dialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        PaperProps={{
          sx: {
            backgroundColor: theme.palette.beige,
            border: `2px solid ${theme.palette.brown}`,
          },
        }}
      >
        <DialogTitle sx={{ color: theme.palette.brown }}>
          {confirmDialog.action === "confirm"
            ? "Confirm Booking"
            : confirmDialog.action === "cancel"
            ? "Cancel Booking"
            : "Delete Booking"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: theme.palette.brown }}>
            {confirmDialog.title ||
              `Are you sure you want to ${confirmDialog.action} this booking?`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setConfirmDialog({ ...confirmDialog, open: false })}
            sx={{ color: theme.palette.brown }}
          >
            No
          </Button>
          <Button
            variant="contained"
            sx={{
              backgroundColor:
                confirmDialog.action === "confirm"
                  ? theme.palette.brown
                  : confirmDialog.action === "cancel"
                  ? theme.palette.orange
                  : theme.palette.orange,
              color: theme.palette.beige,
              "&:hover": {
                backgroundColor:
                  confirmDialog.action === "confirm"
                    ? theme.palette.brown
                    : confirmDialog.action === "cancel"
                    ? theme.palette.orange
                    : theme.palette.orange,
              },
            }}
            onClick={handleAction}
          >
            {confirmDialog.action === "confirm"
              ? "Confirm"
              : confirmDialog.action === "cancel"
              ? "Cancel"
              : "Delete"}
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
          sx={{
            width: "100%",
            backgroundColor:
              alert?.severity === "success"
                ? theme.palette.brown
                : theme.palette.orange,
            color: theme.palette.beige,
          }}
        >
          {alert?.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Bookings;
