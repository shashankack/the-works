import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
  Badge,
  Button,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useState, useEffect } from "react";
import { Link as RouterLink } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";

const drawerWidth = 240;

const Appbar = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [mobileOpen, setMobileOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  useEffect(() => {
    const fetchPendingBookings = async () => {
      try {
        const res = await axiosInstance.get("/admin/bookings?status=PENDING");
        setPendingCount(res.data.length || 0);
      } catch (err) {
        console.error("Failed to fetch pending bookings", err);
      }
    };

    fetchPendingBookings();
    const interval = setInterval(fetchPendingBookings, 60000);
    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  const NavLinks = (
    <>
      <Button
        component={RouterLink}
        to="/admin/dashboard"
        sx={{ color: theme.palette.beige }}
      >
        Home
      </Button>
      <Button
        component={RouterLink}
        to="/admin/trainers"
        sx={{ color: theme.palette.beige }}
      >
        Manage Trainers
      </Button>
      <Button
        component={RouterLink}
        to="/admin/bookings"
        sx={{ color: theme.palette.beige }}
      >
        <Badge
          badgeContent={pendingCount}
          color="error"
          sx={{
            "& .MuiBadge-badge": {
              fontSize: "0.75rem",
              minWidth: 20,
              height: 20,
              padding: "0 6px",
              animation: pendingCount > 0 ? "pulse 1.5s infinite" : "none",
            },
            "@keyframes pulse": {
              "0%": { transform: "scale(1)" },
              "50%": { transform: "scale(1.15)" },
              "100%": { transform: "scale(1)" },
            },
          }}
        >
          <NotificationsIcon color="inherit" sx={{ mr: 1 }} />
        </Badge>
        Manage Bookings
      </Button>

      <Button
        component={RouterLink}
        to="/admin/enquiries"
        sx={{
          color: theme.palette.beige,
        }}
      >
        Enquiries
      </Button>
    </>
  );

  const drawerContent = (
    <Box>
      <Box sx={{ p: 2, backgroundColor: theme.palette.orange }}>
        <Typography variant="h6" fontWeight="bold" color={theme.palette.beige}>
          The Works
        </Typography>
      </Box>
      <List>
        <ListItemButton component={RouterLink} to="/admin/dashboard">
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/admin/trainers">
          <ListItemText primary="Manage Trainers" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/admin/bookings">
          <Box display="flex" alignItems="center" gap={1}>
            <ListItemText primary="Manage Bookings" />
            <Badge
              badgeContent={pendingCount}
              color="error"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.75rem",
                  minWidth: 20,
                  height: 20,
                  padding: "0 6px",
                  animation: pendingCount > 0 ? "pulse 1.5s infinite" : "none",
                },
                "@keyframes pulse": {
                  "0%": { transform: "scale(1)" },
                  "50%": { transform: "scale(1.15)" },
                  "100%": { transform: "scale(1)" },
                },
              }}
            >
              <NotificationsIcon color="action" />
            </Badge>
          </Box>
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.orange,
          zIndex: theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          {isMobile ? (
            <IconButton color="inherit" onClick={toggleDrawer} edge="start">
              <MenuIcon />
            </IconButton>
          ) : (
            <Typography
              variant="h6"
              sx={{ color: theme.palette.beige, fontWeight: "bold" }}
            >
              The Works
            </Typography>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              {NavLinks}
            </Box>
          )}

          <IconButton color="inherit" onClick={logout}>
            Logout
          </IconButton>
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={toggleDrawer}
          sx={{
            width: drawerWidth,
            flexShrink: 0,
            [`& .MuiDrawer-paper`]: {
              width: drawerWidth,
              boxSizing: "border-box",
              borderColor: theme.palette.brown,
              backgroundColor: theme.palette.beige,
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}
    </>
  );
};

export default Appbar;
