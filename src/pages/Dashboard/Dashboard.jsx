import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

import CreateForm from "../../components/Forms/CreateForm";
import EditForm from "../../components/Forms/EditForm";

import dayjs from "dayjs";

import {
  Dialog,
  Typography,
  Button,
  Container,
  Tabs,
  Tab,
  Box,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  IconButton,
  Snackbar,
  Alert,
  Divider,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { useTheme } from "@mui/material/styles";

const STATUS_TABS = ["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"];

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isEditingClass, setIsEditingClass] = useState(false);
  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteIsClass, setDeleteIsClass] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [isCreatingClass, setIsCreatingClass] = useState(false);
  const [activeEventTab, setActiveEventTab] = useState(0);
  const [activeClassTab, setActiveClassTab] = useState(0);
  const theme = useTheme();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/admin/login";
      return;
    }

    axiosInstance
      .get("/events")
      .then((res) => setEvents(res.data.events))
      .catch((err) =>
        setErrors(err.response?.data?.error || "Error fetching events")
      );

    axiosInstance
      .get("/classes")
      .then((res) => setClasses(res.data.classes))
      .catch((err) =>
        setErrors(err.response?.data?.error || "Error fetching classes")
      );
  }, []);

  const showAlert = (message, severity = "success") => {
    setAlert({ open: true, message, severity });
  };

  const filteredEvents = events.filter(
    (event) => event.eventStatus === STATUS_TABS[activeEventTab]
  );

  const filteredClasses = classes.filter(
    (cls) => cls.eventStatus === STATUS_TABS[activeClassTab]
  );

  const renderTable = (items, isClass = false) => (
    <Paper sx={{ mt: 2, maxHeight: 400, overflow: "auto" }}>
      <Table stickyHeader size="small">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Trainer</TableCell>
            <TableCell>Date</TableCell>
            <TableCell>Time</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5}>
                <Typography sx={{ mt: 2 }} color="text.secondary">
                  No {isClass ? "classes" : "events"} in this category.
                </Typography>
              </TableCell>
            </TableRow>
          ) : (
            items.map((item) => {
              let dateDisplay = "—";
              let timeDisplay = "—";

              // Handle Recurring
              if (item.recurrenceRule) {
                try {
                  const rule = JSON.parse(item.recurrenceRule);
                  const day = Object.keys(rule)[0];
                  const time = rule[day];
                  dateDisplay = `Every ${day}`;
                  timeDisplay = `${time.start} - ${time.end}`;
                } catch (err) {
                  console.error("Invalid recurrenceRule format", err);
                }
              }

              // Handle One-Time
              else if (item.startDuration) {
                const date = dayjs(item.startDuration);
                dateDisplay = date.format("DD/MM");
                timeDisplay = date.format("HH:mm");
              }

              return (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{item.trainer?.name || "—"}</TableCell>
                  <TableCell>{dateDisplay}</TableCell>
                  <TableCell>{timeDisplay}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      onClick={() => {
                        setSelectedItem(item);
                        setIsEditingClass(isClass);
                        setEditModalOpen(true);
                      }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => {
                        setDeleteTarget(item);
                        setDeleteIsClass(isClass);
                        setConfirmOpen(true);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Paper>
  );

  const getEventCountByStatus = (status) =>
    events.filter((event) => event.eventStatus === status).length;

  const getClassCountByStatus = (status) =>
    classes.filter((cls) => cls.eventStatus === status).length;

  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, height: "100%" }}>
        {/* Events Section */}
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Events</Typography>
            <Box display="flex" gap={2}>
              <Typography variant="h6">Total: {events.length}</Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setShowModal(true);
                  setIsCreatingClass(false);
                }}
              >
                + Create Event
              </Button>
            </Box>
          </Box>

          <Tabs
            value={activeEventTab}
            onChange={(_, newValue) => setActiveEventTab(newValue)}
            sx={{ mt: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {STATUS_TABS.map((label) => (
              <Tab
                key={label}
                label={`${label} (${getEventCountByStatus(label)})`}
              />
            ))}
          </Tabs>

          {renderTable(filteredEvents, false)}
        </Box>

        <Divider sx={{ my: 6 }} />

        {/* Classes Section */}
        <Box>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Classes</Typography>
            <Box display="flex" gap={2}>
              <Typography variant="h6">Total: {classes.length}</Typography>
              <Button
                variant="contained"
                onClick={() => {
                  setShowModal(true);
                  setIsCreatingClass(true);
                }}
              >
                + Create Class
              </Button>
            </Box>
          </Box>

          <Tabs
            value={activeClassTab}
            onChange={(_, newValue) => setActiveClassTab(newValue)}
            sx={{ mt: 2 }}
            variant="scrollable"
            scrollButtons="auto"
          >
            {STATUS_TABS.map((label) => (
              <Tab
                key={label}
                label={`${label} (${getClassCountByStatus(label)})`}
              />
            ))}
          </Tabs>

          {renderTable(filteredClasses, true)}
        </Box>
      </Container>

      {/* Modal */}
      <CreateForm
        open={showModal}
        onClose={() => setShowModal(false)}
        isClass={isCreatingClass}
      />

      <Dialog
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <EditForm
          open={editModalOpen}
          onClose={() => setEditModalOpen(false)}
          initialData={selectedItem}
          isClass={isEditingClass}
          onSave={(updated) => {
            try {
              setEditModalOpen(false);
              if (isEditingClass) {
                setClasses((prev) =>
                  prev.map((c) => (c.id === updated.id ? updated : c))
                );
              } else {
                setEvents((prev) =>
                  prev.map((e) => (e.id === updated.id ? updated : e))
                );
              }
              showAlert(`${isClass ? "Class" : "Event"} saved successfully.`);
            } catch (err) {
              showAlert("Failed to save item.", "error");
            }
          }}
        />
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <Box p={3}>
          <Typography mb={2}>
            Are you sure you want to delete this{" "}
            {deleteIsClass ? "class" : "event"}?
          </Typography>
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button
              onClick={() => setConfirmOpen(false)}
              color="primary"
              variant="outlined"
            >
              Cancel
            </Button>
            <Button
              onClick={async () => {
                try {
                  const endpoint = `/admin/${
                    deleteIsClass ? "classes" : "events"
                  }/${deleteTarget.id}`;
                  await axiosInstance.delete(endpoint);

                  if (deleteIsClass) {
                    setClasses((prev) =>
                      prev.filter((c) => c.id !== deleteTarget.id)
                    );
                  } else {
                    setEvents((prev) =>
                      prev.filter((e) => e.id !== deleteTarget.id)
                    );
                  }
                  showAlert(
                    `${deleteIsClass ? "Class" : "Event"} deleted successfully!`
                  );

                  setConfirmOpen(false);
                } catch (err) {
                  showAlert("Failed to delete item.", "error");
                }
              }}
              color="error"
              variant="contained"
            >
              Delete
            </Button>
          </Box>
        </Box>
      </Dialog>

      <Snackbar
        open={alert.open}
        autoHideDuration={3000}
        onClose={() => setAlert((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={alert.severity}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {alert.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Dashboard;
