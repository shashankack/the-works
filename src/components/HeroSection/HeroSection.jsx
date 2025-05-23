import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

import heroImage from "/images/hero.png";
import gsap from "gsap";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  const theme = useTheme();
  const containerRef = useRef(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const tl = gsap.timeline();
  const fadeIn = (element) => {
    tl.fromTo(element, { y: 100 }, { y: 0, duration: 0.6, ease: "back.out" });
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      const elements = container.querySelectorAll(".fade-in");
      elements.forEach((element) => {
        fadeIn(element);
      });
    }
  }, []);

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
        ref={containerRef}
        width={isMobile ? "90%" : "60%"}
        position="absolute"
        bottom={100}
        left="50%"
        textAlign="center"
        sx={{
          transform: "translateX(-50%)",
        }}
      >
        <Box overflow="hidden">
          <Typography
            className="fade-in"
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
        </Box>
        <Box overflow="hidden">
          <Typography
            className="fade-in"
            variant="h5"
            fontWeight={500}
            textTransform="uppercase"
            fontSize={isMobile ? "3.5vw" : "1.2vw"}
            color={theme.palette.beige}
            fontFamily={theme.fonts.primary}
          >
            A vibrant oasis in the heart of Bangalore, where movement, culture,
            and creativity come alive.
          </Typography>
        </Box>

        <Box overflow="hidden">
          <Button
            sx={{
              mt: 3,
              py: 0.3,
              px: 5,
              backgroundColor: "transparent",
              fontSize: isMobile ? "3.5vw" : "1.3vw",
              color: theme.palette.beige,
              border: `2px solid ${theme.palette.beige}`,
              borderRadius: "50px",
              fontFamily: theme.fonts.primary,
              transition: "transform 0.3s ease",
              "&:hover": {
                backgroundColor: theme.palette.beige,
                color: theme.palette.orange,
                transform: "scale(1.1)",
              },
            }}
          >
            explore
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default HeroSection;
