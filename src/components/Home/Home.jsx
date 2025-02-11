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

  const mockData = {
    classes: [
      {
        id: 1,
        title: "WICK3D Jiu-Jutsu: Women's Collection",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: yoga,
        redirect:
          "https://shashankdev.dayschedule.com/wick3d-jiu-jutsu-womens-collection",
      },
      {
        id: 2,
        title: "Pilates",
        description:
          "Pilate is a physical fitness system developed in the early 20th century by Joseph Pilates, after whom it was named.",
        image: yoga,
      },
      {
        id: 3,
        title: "Strength Training",
        description:
          "Strength training is a type of physical exercise specializing in the use of resistance to induce muscular contraction which builds the strength, anaerobic endurance, and size of skeletal muscles.",
        image: yoga,
      },
      {
        id: 4,
        title: "WICK3D Jiu-Jutsu: Women's Collection",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: yoga,
        redirect:
          "https://shashankdev.dayschedule.com/wick3d-jiu-jutsu-womens-collection",
      },
      {
        id: 5,
        title: "Advanced Jiujitsu",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: yoga,
      },
      {
        id: 6,
        title: "Kickboxing Workout",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: yoga,
      },
      {
        id: 7,
        title: "Kickboxing Workout",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: yoga,
      },
    ],
    events: [
      {
        id: 1,
        title: "Community Yoga Session",
        description: "Join us for a free outdoor yoga session.",
        image: yoga,
      },
      {
        id: 2,
        title: "Boxing Challenge",
        description: "Test your skills in our friendly boxing match.",
        image: yoga,
      },
      {
        id: 3,
        title: "Book Reading & Discussion",
        description: "Engage in a deep conversation about inspiring books.",
        image: yoga,
      },
    ],
  };
  

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
