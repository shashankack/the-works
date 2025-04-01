import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  EffectCreative,
  Autoplay,
  Pagination,
  Navigation,
} from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-creative";
import { gsap } from "gsap";

import "./HeroSection.scss";

const HeroSection = ({ images }) => {
  useEffect(() => {
    gsap.from(".hero-title", {
      opacity: 0,
      y: -50,
      duration: 1.5,
      ease: "power3.out",
    });

    gsap.from(".hero-intro", {
      opacity: 0,
      y: 30,
      duration: 1.5,
      delay: 0.5,
      ease: "power3.out",
    });
  }, []);

  return (
    <section className="hero-section">
      <Swiper
        grabCursor={true}
        effect={"creative"}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        speed={1000}
        pagination={{
          clickable: true,
        }}
        navigation
        loop={true}
        creativeEffect={{
          prev: {
            shadow: true,
            translate: ["-20%", 0, -1],
          },
          next: {
            translate: ["100%", 0, 0],
          },
        }}
        modules={[EffectCreative, Pagination, Navigation, Autoplay]}
        className="hero-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index}>
            <img src={image} alt="Hero Slide" className="hero-section__image" />
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="hero-content">
        <h1 className="hero-title">Welcome to The Works</h1>
        <p className="hero-intro">
          A vibrant oasis in the heart of Bangalore, where movement, culture,
          and creativity come alive.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
