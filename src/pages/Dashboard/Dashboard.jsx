import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { logout } from "../../utils/auth";
import CreateForm from "../../components/Forms/CreateForm";
import dayjs from "dayjs";

import {
  AppBar,
  Toolbar,
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
                      onClick={() =>
                        navigate(
                          `/admin/${isClass ? "classes" : "events"}/${item.id}`
                        )
                      }
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton color="error">
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
    </>
  );
};

export default Dashboard;
