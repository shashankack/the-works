import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge,
  IconButton,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import axiosInstance from "../../../utils/axiosInstance";

const Sidebar = () => {
  const theme = useTheme();
  const [pendingCount, setPendingCount] = useState(0);

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
    const interval = setInterval(fetchPendingBookings, 60000); // auto refresh every 60s
    return () => clearInterval(interval);
  }, []);

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          borderColor: theme.colors.brown,
          backgroundColor: theme.colors.beige,
        },
      }}
    >
      <Box sx={{ p: 2 }} backgroundColor={theme.colors.orange}>
        <Typography variant="h6" fontWeight="bold" color={theme.colors.beige}>
          The Works
        </Typography>
      </Box>

      <Divider />

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
                  "0%": {
                    transform: "scale(1)",
                  },
                  "50%": {
                    transform: "scale(1.15)",
                  },
                  "100%": {
                    transform: "scale(1)",
                  },
                },
              }}
            >
              <NotificationsIcon color="action" />
            </Badge>
          </Box>
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
