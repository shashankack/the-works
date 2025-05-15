import { useState, useEffect } from "react";
import {
  Box,
  AppBar,
  Typography,
  Stack,
  Button,
  useTheme,
  useMediaQuery,
  Drawer,
} from "@mui/material";

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [isScrolled, setIsScrolled] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const scrollThreshold = 50;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = Math.abs(currentScrollY - lastScrollY);

      if (diff < scrollThreshold) return;

      if (currentScrollY < lastScrollY) {
        setIsScrolled(false);
      } else {
        setIsScrolled(true);
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Classes", path: "/classes" },
    { name: "Events", path: "/events" },
  ];

  const handleNavigation = (path) => {
    window.location.href = path;
    setIsDrawerOpen(false);
  };

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.beige,
          px: 5,
          py: 1,
          transition: "all 0.3s ease",
          transform: isScrolled ? "translateY(-110%)" : "translateY(0)",
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" color={theme.palette.orange}>
            The Works
          </Typography>

          {isMobile ? (
            <Box
              onClick={() => setIsDrawerOpen(true)}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: 24,
                height: 18,
                cursor: "pointer",
              }}
            >
              {[0, 1, 2].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    zIndex: 2000,
                    height: 3,
                    width: "100%",
                    backgroundColor: theme.palette.orange,
                    borderRadius: 2,
                  }}
                />
              ))}
            </Box>
          ) : (
            <Stack direction="row" spacing={5} alignItems="center">
              {navItems.map((item) => (
                <Typography
                  key={item.name}
                  variant="body1"
                  color={theme.palette.orange}
                  sx={{ cursor: "pointer", mx: 2 }}
                  onClick={() => handleNavigation(item.path)}
                >
                  {item.name}
                </Typography>
              ))}
              <Button
                variant="outlined"
                color="inherit"
                sx={{
                  backgroundColor: theme.palette.brown,
                  color: theme.palette.beige,
                  "&:hover": {
                    backgroundColor: theme.palette.orange,
                    color: theme.palette.beige,
                  },
                }}
                onClick={() => handleNavigation("/contact")}
              >
                Contact Us
              </Button>
            </Stack>
          )}
        </Box>
      </AppBar>

      <Drawer
        anchor="right"
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        sx={{
          "& .MuiDrawer-paper": {
            backgroundColor: theme.palette.beige,
            width: "250px",
            padding: 2,
          },
        }}
      >
        <Stack spacing={3}>
          {navItems.map((item) => (
            <Typography
              key={item.name}
              variant="h6"
              color={theme.palette.orange}
              sx={{ cursor: "pointer" }}
              onClick={() => handleNavigation(item.path)}
            >
              {item.name}
            </Typography>
          ))}
          <Button
            variant="outlined"
            color="inherit"
            sx={{
              backgroundColor: theme.palette.brown,
              color: theme.palette.beige,
              "&:hover": {
                backgroundColor: theme.palette.orange,
                color: theme.palette.beige,
              },
            }}
            onClick={() => handleNavigation("/contact")}
          >
            Contact Us
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default Header;
