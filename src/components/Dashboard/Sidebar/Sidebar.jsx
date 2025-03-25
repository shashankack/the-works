import React from "react";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { useTheme } from "@mui/material/styles";

const Sidebar = () => {
  const theme = useTheme();

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
          <ListItemText primary="Manage Bookings" />
        </ListItemButton>
      </List>
    </Drawer>
  );
};

export default Sidebar;
