import HeroSection from "../components/HeroSection/HeroSection";
import AboutSection from "../components/AboutSection";
import EventsSection from "./EventsSection/EventsSection";
import Testimonials from "./TrainersSection/Testimonials";

import desktopCarousel1 from "../assets/desktop-carousel-1.jpg";
import desktopCarousel2 from "../assets/desktop-carousel-2.jpg";
import desktopCarousel3 from "../assets/desktop-carousel-3.jpg";
import mobileCarousel1 from "../assets/mobile-carousel-1.jpg";
import mobileCarousel2 from "../assets/mobile-carousel-2.jpg";
import mobileCarousel3 from "../assets/mobile-carousel-3.jpg";

import { trainers } from "../../public/dummyData";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactSection from "../components/ContactSection";
import TeamSection from "../components/TeamSection";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const isMobile = window.innerWidth <= 768;
  const mobileSlider = [mobileCarousel1, mobileCarousel2, mobileCarousel3];
  const desktopSlider = [desktopCarousel1, desktopCarousel2, desktopCarousel3];

  const sliderContent = isMobile ? mobileSlider : desktopSlider;

  return (
    <>
      <HeroSection images={sliderContent} />
      <AboutSection />
      <EventsSection />
      <TeamSection />
      <ContactSection />
    </>
  );
};

export default Home;
