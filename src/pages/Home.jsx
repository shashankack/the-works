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

import { trainers } from "../../public/dummyData";

import { useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./Home.scss";
import ContactSection from "../components/ContactSection/ContactSection";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const mobileSlider = [mobileCarousel1, mobileCarousel2, mobileCarousel3];
  const desktopSlider = [desktopCarousel1, desktopCarousel2, desktopCarousel3];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sectionClasses = [
    ".hero-div",
    ".about-div",
    ".events-div",
    ".trainers-div",
    ".contact-div",
  ];

  useEffect(() => {
    sectionClasses.forEach((section, index) => {
      if (index < sectionClasses.length - 1) {
        gsap.fromTo(
          section,
          { scale: 1, opacity: 1 },
          {
            scale: 0.8,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          }
        );
      }
    });
  }, []);

  const sliderContent = isMobile ? mobileSlider : desktopSlider;

  return (
    <>
      <div className="hero-div">
        <HeroSection images={sliderContent} />
      </div>
      <div className="about-div">
        <AboutSection />
      </div>
      <div className="events-div">
        <EventsSection />
      </div>
      <div className="trainers-div">
        <Testimonials data={trainers} />
      </div>
      <div className="contact-div">
        <ContactSection />
      </div>
    </>
  );
};

export default Home;
