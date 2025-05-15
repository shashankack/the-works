import { Box, Typography, useMediaQuery, useTheme, Stack } from "@mui/material";

import founderImg from "/images/founder.png";

const aboutData = [
  {
    title: "Our Legacy and Vision",
    description:
      "Rooted in The Nilgiris 1905 legacy, The Works blends tradition and creativity a space for communities to move, connect, and grow together.",
  },
  {
    title: "Our Space",
    description:
      "The Works is a space where movement, art, and community come together. Whether you're training, creating, or connecting it’s a place to grow, express, and belong.",
  },
  {
    title: "What to expect",
    description:
      "Train with purpose at The Works personalized kickboxing and Muay Thai sessions that build strength, confidence, and discipline, in and out of the gym.",
  },
];

const AboutSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box>
      <Box
        height="100vh"
        bgcolor={theme.palette.orange}
        display="flex"
        justifyContent="center"
        alignItems="center"
        overflow="hidden"
      >
        <Box
          ml="-15vw"
          position="relative"
          height={700}
          width="55vw"
          display="flex"
          flexDirection="column"
          justifyContent="start"
          alignItems="center"
          textAlign="center"
          padding={20}
        >
          <Typography
            variant="h2"
            fontSize="3.4vw"
            fontFamily={theme.fonts.primary}
            textTransform="uppercase"
            fontWeight={500}
            whiteSpace="nowrap"
          >
            Meet our founder
          </Typography>
          <Typography
            fontFamily={theme.fonts.primary}
            variant="body1"
            fontWeight={400}
            mt={2}
            textAlign="justify"
            width={"80%"}
          >
            Meet Raghuram martial artist, community builder, legacy holder. With
            deep roots in Muay Thai and Kickboxing, he turned passion into
            purpose running a private gym and now, The Works. It’s not just
            about strength, it’s about self-expression, discipline, and creating
            space for others to thrive.
          </Typography>

          <Box
            width="50vw"
            overflow="hidden"
            sx={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-50%)",
              left: "35vw",
            }}
          >
            <Box
              component="img"
              src={founderImg}
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Box>
      </Box>

      <Stack
        bgcolor={theme.palette.beige}
        height="70vh"
        direction="row"
        gap={10}
        p={10}
        justifyContent="space-evenly"
      >
        {aboutData.map((item, index) => (
          <Box
            key={index}
            bgcolor={theme.palette.orange}
            width="100%"
            maxWidth="20vw"
            boxShadow="6px 6px 0 0 #4E2916"
          >
            <Typography
              variant="h6"
              fontSize="1.4vw"
              fontFamily={theme.fonts.primary}
              textTransform="uppercase"
              fontWeight={500}
              whiteSpace="nowrap"
              textAlign="center"
              mt={5}
            >
              {item.title}
            </Typography>
            <Typography
              fontFamily={theme.fonts.primary}
              variant="body1"
              fontSize="1.4vw"
              fontWeight={400}
              mt={2}
              textAlign="start"
              width={"80%"}
              marginX="auto"
            >
              {item.description}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default AboutSection;
