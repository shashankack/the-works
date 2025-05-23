import { useState, useRef } from "react";
import {
  Box,
  Typography,
  IconButton,
  useTheme,
  Stack,
  useMediaQuery,
} from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

import { trainers } from "../../public/dummyData";
import trainersBg from "/images/trainer.png";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import gsap from "gsap";

const TeamSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);

  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const swiperRef = useRef(null);

  const nameRef = useRef(null);
  const roleRef = useRef(null);
  const textRef = useRef(null);

  const animateOutro = () => {
    return gsap.to([nameRef.current, roleRef.current, textRef.current], {
      duration: 0.3,
      yPercent: -100,
      opacity: 1,
      stagger: 0.1,
      ease: "back.in",
    });
  };

  const animateIntro = () => {
    return gsap.fromTo(
      [nameRef.current, roleRef.current, textRef.current],
      { yPercent: 100, opacity: 0 },
      {
        duration: 0.3,
        yPercent: 0,
        opacity: 1,
        stagger: 0.1,
        ease: "back.out",
      }
    );
  };

  const changeSlide = (newIndex) => {
    if (animating || newIndex === activeIndex) return;

    setAnimating(true);
    animateOutro().eventCallback("onComplete", () => {
      setActiveIndex(newIndex);
      if (swiperRef.current) swiperRef.current.slideTo(newIndex, 0);
      animateIntro().eventCallback("onComplete", () => setAnimating(false));
    });
  };

  const handlePrev = () => {
    const newIndex = activeIndex === 0 ? trainers.length - 1 : activeIndex - 1;
    changeSlide(newIndex);
  };

  const handleNext = () => {
    const newIndex = activeIndex === trainers.length - 1 ? 0 : activeIndex + 1;
    changeSlide(newIndex);
  };

  const handleSlideChange = (swiper) => {
    changeSlide(swiper.activeIndex);
  };

  const currentTrainer = trainers[activeIndex];

  return (
    <Box
      height={isMobile ? "auto" : "100vh"}
      px={isMobile ? 1 : 10}
      display="flex"
      justifyContent="center"
      alignItems="center"
      flexDirection={isMobile ? "column" : "row"}
      sx={{
        backgroundColor: "#E9E3DA",
        backgroundImage: `url(${trainersBg})`,
        backgroundAttachment: "fixed",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        color: theme.palette.brown,
        fontFamily: "'Montserrat', sans-serif",
      }}
    >
      {isMobile && (
        <Typography
          variant="h4"
          fontSize="8vw"
          fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
          fontWeight={700}
          mb={1}
          sx={{ letterSpacing: 1, textTransform: "uppercase" }}
        >
          Meet Your Coach
        </Typography>
      )}
      <Box
        width={isMobile ? " 95vw" : "30vw"}
        height={isMobile ? "40vh" : "60vh"}
        sx={{ position: "relative" }}
      >
        <Swiper
          modules={[Navigation]}
          slidesPerView={1}
          loop={true}
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          onSlideChange={handleSlideChange}
          navigation={{
            prevEl: prevBtnRef.current,
            nextEl: nextBtnRef.current,
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevBtnRef.current;
            swiper.params.navigation.nextEl = nextBtnRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          style={{ height: "100%" }}
        >
          {trainers.map((trainer) => (
            <SwiperSlide key={trainer.id}>
              <Box
                component="img"
                src={trainer.image}
                alt={trainer.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  userSelect: "none",
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        <IconButton
          ref={prevBtnRef}
          onClick={handlePrev}
          sx={{
            position: "absolute",
            top: "50%",
            left: 8,
            transform: "translateY(-50%)",
            color: theme.palette.orange,
            bgcolor: "rgba(0,0,0,0)",
            transition: "all 0.3s ease",
            "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
            zIndex: 10,
          }}
          aria-label="previous"
        >
          <FaChevronLeft />
        </IconButton>
        <IconButton
          ref={nextBtnRef}
          onClick={handleNext}
          sx={{
            position: "absolute",
            top: "50%",
            right: 8,
            transform: "translateY(-50%)",
            color: theme.palette.orange,
            bgcolor: "rgba(0,0,0,0)",
            transition: "all 0.3s ease",
            "&:hover": { bgcolor: "rgba(0,0,0,0.1)" },
            zIndex: 10,
          }}
          aria-label="next"
        >
          <FaChevronRight />
        </IconButton>
      </Box>

      <Stack
        ml={isMobile ? 0 : 6}
        width={isMobile ? "100%" : "40vw"}
        height={isMobile ? "auto" : "60vh"}
        gap={2}
        justifyContent="start"
      >
        {!isMobile && (
          <Typography
            variant={isMobile ? "h5" : "h2"}
            fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
            fontWeight={700}
            mb={1}
            sx={{ letterSpacing: 1, textTransform: "uppercase" }}
          >
            Meet Your Coach
          </Typography>
        )}

        <Box overflow="hidden">
          <Typography
            ref={nameRef}
            variant="h3"
            fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
            fontWeight={700}
            mb={1}
            sx={{ color: "#B35A26" }}
          >
            {currentTrainer.name}
          </Typography>
        </Box>

        <Box overflow="hidden">
          <Typography
            ref={roleRef}
            variant="h5"
            fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
            fontWeight={600}
            color={theme.palette.orange}
            textTransform="uppercase"
            letterSpacing={1}
          >
            {currentTrainer.role}
          </Typography>
        </Box>

        <Box overflow="hidden" minHeight={150}>
          <Typography
            ref={textRef}
            variant="h6"
            fontFamily={theme.fonts?.primary || "'Montserrat', sans-serif"}
            color={theme.palette.brown}
            mb={10}
          >
            {currentTrainer.text}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
};

export default TeamSection;
