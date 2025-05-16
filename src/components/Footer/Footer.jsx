import {
  Box,
  useMediaQuery,
  useTheme,
  Stack,
  Typography,
  Link,
  Divider,
} from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Classes", path: "/classes" },
    { name: "Events", path: "/events" },
  ];

  const socialLinks = [
    { name: "YouTube", path: "https://www.youtube.com" },
    { name: "LinkedIn", path: "https://www.linkedin.com" },
    { name: "Facebook", path: "https://www.facebook.com" },
    { name: "Instagram", path: "https://www.instagram.com" },
  ];

  const linkStyles = {
    textTransform: "uppercase",
    fontFamily: theme.fonts.primary,
    fontWeight: 400,
    textAlign: "end",
    fontSize: isMobile ? "2vw" : "1.2vw",
    color: theme.palette.orange,
    textDecoration: "none",
    display: "block",
    cursor: "pointer",
    transition: "all 0.3s ease",

    "&:hover": {
      color: theme.palette.brown,
      transform: "scale(1.05)",
    },
    mb: 1,
  };

  return (
    <Box
      height={isMobile ? "auto" : "40vh"}
      width="100%"
      display="flex"
      justifyContent="start"
      alignItems="start"
      flexDirection="column"
      bgcolor={theme.palette.beige}
      px={10}
      py={4}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="end"
        width="100%"
        gap={6}
        height={30}
      >
        {navLinks.map((link, index) => (
          <Link key={index} to={link.path} sx={linkStyles}>
            {link.name}
          </Link>
        ))}
      </Stack>

      <Stack
        direction="row"
        justifyContent="space-between"
        width="100%"
        height="100%"
      >
        <Stack direction="column">
          <Typography
            variant="h1"
            color={theme.palette.orange}
            fontFamily={theme.fonts.primary}
            fontWeight={700}
            textTransform="uppercase"
          >
            The Works
          </Typography>
          <Typography
            variant="body1"
            color={theme.palette.brown}
            fontFamily={theme.fonts.primary}
            fontSize="1.2vw"
          >
            Build What Moves You.
          </Typography>
        </Stack>

        <Stack height="100%" justifyContent="end">
          {socialLinks.map((link, index) => (
            <Link key={index} href={link.path} sx={linkStyles}>
              {link.name}
            </Link>
          ))}
        </Stack>
      </Stack>

      <Divider
        sx={{
          width: "100%",
          border: `1px solid ${theme.palette.brown}`,
          mt: 4,
          mb: 1,
        }}
      />
      <Typography
        variant="subtitle1"
        color={theme.palette.orange}
        textAlign="center"
        width="100%"
      >
        @2025Theworks. All rights reserved
      </Typography>
    </Box>
  );
};

export default Footer;
