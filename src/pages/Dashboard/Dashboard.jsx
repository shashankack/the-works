import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { logout } from "../../utils/auth";
import CreateForm from "../../components/Dashboard/CreateForm/CreateForm";

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Box,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";

import { useTheme } from "@mui/material/styles";

const STATUS_TABS = ["UPCOMING", "INPROGRESS", "COMPLETED", "CANCELLED"];

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

  return (
    <>
      {/* Navbar */}
      <AppBar position="static" sx={{ backgroundColor: theme.colors.orange }}>
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Typography variant="h6">Admin Dashboard</Typography>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 6, height: "100%" }}>
        {/* Events Section */}
        <Box mt={6}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h5">Events</Typography>
            <Box display="flex" alignItems="space-between" gap={2}>
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
              <Tab key={label} label={label} />
            ))}
          </Tabs>

          <List sx={{ mt: 2 }}>
            {filteredEvents.map((event) => (
              <ListItemButton
                key={event.id}
                onClick={() => navigate(`/admin/events/${event.id}`)}
              >
                <ListItemText
                  primary={event.title}
                  secondary={event.eventStatus}
                />
              </ListItemButton>
            ))}
            {filteredEvents.length === 0 && (
              <Typography sx={{ mt: 2 }} color="text.secondary">
                No events in this category.
              </Typography>
            )}
          </List>
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
            <Box display="flex" alignItems="space-between" gap={2}>
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
              <Tab key={label} label={label} />
            ))}
          </Tabs>

          <List sx={{ mt: 2 }}>
            {filteredClasses.map((cls) => (
              <ListItemButton
                key={cls.id}
                onClick={() => navigate(`/admin/classes/${cls.id}`)}
              >
                <ListItemText primary={cls.title} secondary={cls.eventStatus} />
              </ListItemButton>
            ))}
            {filteredClasses.length === 0 && (
              <Typography sx={{ mt: 2 }} color="text.secondary">
                No classes in this category.
              </Typography>
            )}
          </List>
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
