import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

import heroImage from "/images/hero.png";

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box height="100vh" position="relative" overflow="hidden">
      <Box
        component="img"
        src={heroImage}
        sx={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
      />
      <Box
        width={isMobile ? "90%" : "60%"}
        position="absolute"
        bottom={100}
        left="50%"
        textAlign="center"
        sx={{
          transform: "translateX(-50%)",
        }}
      >
        <Typography
          variant="h3"
          fontSize={isMobile ? "4vw" : "3vw"}
          fontWeight={700}
          textTransform="uppercase"
          color={theme.palette.beige}
          fontFamily={theme.fonts.primary}
          whiteSpace="nowrap"
        >
          Welcome to the works
        </Typography>
        <Typography
          variant="h5"
          fontSize={isMobile ? "3.5vw" : "2vw"}
          color={theme.palette.beige}
          fontFamily={theme.fonts.primary}
        >
          A vibrant oasis in the heart of Bangalore, where movement, culture,
          and creativity come alive.
        </Typography>

        <Button
          sx={{
            mt: 3,
            py: 0.3,
            px: 5,
            backgroundColor: "transparent",
            color: theme.palette.beige,
            border: `2px solid ${theme.palette.beige}`,
            borderRadius: "50px",
          }}
        >
          View
        </Button>
      </Box>
    </Box>
  );
};

export default HeroSection;
