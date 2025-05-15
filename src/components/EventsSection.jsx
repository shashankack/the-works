import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import axiosInstance from "../utils/axiosInstance";
import LoadingScreen from "./Loader";

import {
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Divider,
  Stack,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const EventsSection = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [activeTab, setActiveTab] = useState("classes");
  const [classesData, setClassesData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classesError, setClassesError] = useState(null);
  const [eventsError, setEventsError] = useState(null);

  const isClassesTab = activeTab === "classes";
  const data = isClassesTab ? classesData : eventsData;
  const errorMessage = isClassesTab ? classesError : eventsError;

  const handleRedirect = (item, type) => {
    navigate(`/${type}/${item.id}`);
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, eventsResponse] = await Promise.all([
          axiosInstance.get("/classes"),
          axiosInstance.get("/events"),
        ]);

        if (classesResponse.data?.error)
          setClassesError(classesResponse.data.error);
        else setClassesData(classesResponse.data.classes || []);

        if (eventsResponse.data?.error)
          setEventsError(eventsResponse.data.error);
        else setEventsData(eventsResponse.data.events || []);
      } catch (error) {
        setClassesError("No classes at the moment");
        setEventsError("No Events at the moment");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Box
      height="100vh"
      bgcolor={theme.palette.beige}
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Typography
        fontFamily={theme.fonts.primary}
        color={theme.palette.orange}
        variant="h3"
        fontWeight={700}
      >
        Upcoming {isClassesTab ? "Classes" : "Events"}
        <Divider
          sx={{
            width: "80%",
            height: "3px",
            backgroundColor: theme.palette.brown,
            mt: 1,
            marginInline: "auto",
          }}
        />
        <Stack
          gap={4}
          direction="row"
          mt={1}
          display="flex"
          alignItems="center"
          justifyContent="center"
          borderColor={theme.palette.brown}
        >
          <Button
            onClick={() => setActiveTab("classes")}
            sx={{
              borderRadius: 10,
              backgroundColor: isClassesTab
                ? theme.palette.orange
                : theme.palette.beige,
              color: isClassesTab ? theme.palette.beige : theme.palette.orange,
              border: `1px solid ${theme.palette.orange}`,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: isClassesTab
                  ? theme.palette.orange
                  : theme.palette.beige,
              },
            }}
          >
            Classes
          </Button>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              border: `1px solid ${theme.palette.brown}`,
            }}
          />

          <Button
            onClick={() => setActiveTab("events")}
            sx={{
              borderRadius: 10,
              backgroundColor: !isClassesTab
                ? theme.palette.orange
                : theme.palette.beige,
              color: !isClassesTab ? theme.palette.beige : theme.palette.orange,
              border: `1px solid ${theme.palette.orange}`,
              textTransform: "capitalize",
              "&:hover": {
                backgroundColor: !isClassesTab
                  ? theme.palette.orange
                  : theme.palette.beige,
              },
            }}
          >
            Events
          </Button>
        </Stack>
      </Typography>

      <Box border="1px solid black" width="90%">
        {loading ? (
          <LoadingScreen />
        ) : errorMessage ? (
          <Typography
            fontFamily={theme.fonts.primary}
            color={theme.palette.orange}
            variant="h5"
            fontWeight={700}
            textAlign="center"
          >
            {errorMessage}
          </Typography>
        ) : (
          <Swiper
            modules={[FreeMode, Navigation]}
            spaceBetween={10}
            slidesPerView={isMobile ? 1 : 4}
            navigation
            freeMode
            style={{
              height: "450px",
            }}
          >
            {data.map((item) => (
              <SwiperSlide key={item.id} style={{ border: "1px solid black" }}>
                <Box>
                  <Box
                    component="img"
                    src={item.thumbnail}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </Box>
    </Box>
  );
};

export default EventsSection;
