import { AppBar, Button, Toolbar, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const Appbar = () => {
  const theme = useTheme();

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/admin/login";
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: theme.palette.orange }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">Admin Dashboard</Typography>
        <Button color="inherit" onClick={logout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
