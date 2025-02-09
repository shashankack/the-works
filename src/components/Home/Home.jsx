import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import Test from "../Test/Test";
import Testimonials from "../Testimonials/Testimonials";

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

  const aboutSectionRef = useRef(null);
  const imageRef = useRef(null);
  const textRef = useRef(null);
  const gsapContext = useRef(null);

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

  useEffect(() => {
    gsapContext.current = gsap.context(() => {
      gsap.from(imageRef.current, {
        x: -200,
        opacity: 0,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top 35%",
          toggleActions: "play none none reverse",
        },
      });

      gsap.from(textRef.current, {
        opacity: 0,
        y: 50,
        duration: 0.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: aboutSectionRef.current,
          start: "top 35%",
          toggleActions: "play none none reverse",
          markers: true,
        },
      });
    });

    return () => gsapContext.current.revert();
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
  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      role: "Product Manager at TechFlow",
      text: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      image: portrait1,
    },
    {
      id: 2,
      name: "James Carter",
      role: "Software Engineer at DevCorp",
      text: "An exceptional experience with seamless integration. It’s rare to find something so well-crafted!",
      image: "https://placehold.co/300",
    },
    {
      id: 3,
      name: "Emily Johnson",
      role: "Marketing Lead at BrightIdeas",
      text: "A game-changer for our team. The ease of use and thoughtful design make it an absolute must-have.",
      image: "https://placehold.co/300",
    },
  ];

  return (
    <>
      <section className="hero-section">
        <Test images={sliderContent} />
      </section>

      <section className="about-section" ref={aboutSectionRef}>
        <div className="container">
          <h2>
            About Us <hr />{" "}
          </h2>
          <div className="top-container">
            <p>
              Rooted in the century-old legacy of The Nilgiris 1905, The Works
              is a space built on tradition, perseverance, and community.
              Evolving through four generations, it is now a vibrant hub where
              movement, creativity, and connection come together. We believe in
              giving back creating an inclusive, inspiring space for
              exploration, collaboration, and self-growth. Whether through
              fitness, artistic expression, or shared experiences, The Works is
              a place to move, create, and thrive.
            </p>
          </div>
          <div className="text-container">
            <div className="left">
              <img
                src={founder}
                alt="Founder"
                ref={imageRef}
                className="founder-image"
              />
            </div>
            <div className="right">
              <h2 ref={textRef} >About the Founder</h2>
              <p ref={textRef}>
                A dedicated martial artist, Raghuram has spent years mastering
                kickboxing and Muay Thai, transforming his expertise into a
                private gym that fosters confidence, discipline, and holistic
                strength. Inspired by his family's legacy, he envisioned The
                Works as more than a gym—a dynamic community space where
                movement and creativity intersect. Here, individuals can push
                boundaries, express freely, and grow together.
              </p>
              <p></p>
            </div>
          </div>
        </div>
      </section>

      <section className="upcoming-events-section">
        <div className="container">
          <h2>
            Upcoming {activeTab === "classes" ? "Classes" : "Events"} <hr />
          </h2>

          <div className="tabs">
            <button
              className={activeTab === "classes" ? "active" : ""}
              onClick={() => setActiveTab("classes")}
            >
              Classes
            </button>
            <button
              className={activeTab === "events" ? "active" : ""}
              onClick={() => setActiveTab("events")}
            >
              Events
            </button>
          </div>

          <div className="events">
            <Swiper
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 40 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
              }}
              loop={true}
              grabCursor={true}
              modules={[FreeMode, Pagination, Navigation]}
              pagination={{ clickable: true }}
              freeMode={true}
              navigation={true}
              style={{
                padding: "20px",
              }}
            >
              {mockData[activeTab].map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="card">
                    <img src={item.image} alt={item.title} />
                    <h3>{item.title}</h3>
                    <a href={item.redirect}>Read More</a>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
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
