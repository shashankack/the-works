import HeroSection from "../components/HeroSection/HeroSection";
import AboutSection from "./AboutSection/AboutSection";
import EventsSection from "./EventsSection/EventsSection";
import Testimonials from "./TrainersSection/Testimonials";

import desktopCarousel1 from "../assets/desktop-carousel-1.jpg";
import desktopCarousel2 from "../assets/desktop-carousel-2.jpg";
import desktopCarousel3 from "../assets/desktop-carousel-3.jpg";
import mobileCarousel1 from "../assets/mobile-carousel-1.jpg";
import mobileCarousel2 from "../assets/mobile-carousel-2.jpg";
import mobileCarousel3 from "../assets/mobile-carousel-3.jpg";

import { dummyClasses, dummyEvents, trainers } from "../../public/dummyData";




const Home = () => {
  const sliderContent = [
    desktopCarousel1,
    desktopCarousel2,
    desktopCarousel3,
    /* mobileCarousel1,
    mobileCarousel2,
    mobileCarousel3, */
  ];

  

  return (
    <>
      <HeroSection images={sliderContent}/>
      <AboutSection />
      <EventsSection classesData={dummyClasses} eventsData={dummyEvents} />
      <Testimonials data={trainers} />
    </>
  );
};

export default Home;
