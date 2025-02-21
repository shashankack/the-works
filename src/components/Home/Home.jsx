import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Test from "../HeroSection/HeroSection";
import Testimonials from "../TrainersSection/Testimonials";

import "./Home.scss";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, FreeMode, Pagination, Navigation } from "swiper/modules";

import desktopCarousel1 from "../../assets/desktop-carousel-1.jpg";
import desktopCarousel2 from "../../assets/desktop-carousel-2.jpg";
import desktopCarousel3 from "../../assets/desktop-carousel-3.jpg";
import mobileCarousel1 from "../../assets/mobile-carousel-1.jpg";
import mobileCarousel2 from "../../assets/mobile-carousel-2.jpg";
import mobileCarousel3 from "../../assets/mobile-carousel-3.jpg";
import portrait1 from "../../assets/portrait-1.jpg";

import founder from "../../assets/raghu_founder.jpg";
import cards from "../../assets/cards.jpeg";
import yoga from "../../assets/yoga.webp";

gsap.registerPlugin(ScrollTrigger);

const Home = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [activeTab, setActiveTab] = useState("classes");

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const sliderContent = [desktopCarousel1, desktopCarousel2, desktopCarousel3];

  return (
    <>
      <section className="hero-section">
        <Test images={sliderContent} />
      </section>

      <section className="instructors-section">
        <h2>
          Meet Our Instructors <hr />
        </h2>
        <Testimonials testimonials={testimonials} />
      </section>
    </>
  );
};

export default Home;
