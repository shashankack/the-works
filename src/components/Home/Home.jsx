import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import Test from "../Test/Test";

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

import founder from "../../assets/raghu_founder.jpg";
import cards from "../../assets/cards.jpeg";
import yoga from "../../assets/yoga.webp";

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

      <section className="about-section">
        <div className="container">
          <h2>About Us</h2>
          <p>
            Rooted in the century-old legacy of The Nilgiris 1905, The Works is
            a space built on tradition, perseverance, and community. Evolving
            through four generations, it is now a vibrant hub where movement,
            creativity, and connection come together. We believe in giving back
            creating an inclusive, inspiring space for exploration,
            collaboration, and self-growth. Whether through fitness, artistic
            expression, or shared experiences, The Works is a place to move,
            create, and thrive.
          </p>
          <div className="founder">
            <div className="text-container">
              <p>
                Raghuram, a dedicated martial artist specializing in kickboxing
                and Muay Thai, has created a private gym where individuals build
                confidence, strength, and discipline. Inspired by his family's
                century-old business, he expanded his vision beyond martial arts
                to establish The Works—a multi-purpose community space. More
                than a gym, The Works is a hub for fitness and creative
                expression, where people can explore art, connect, and grow.
                Raghuram believes in the transformative power of both physical
                and artistic practices, fostering a supportive environment that
                encourages self-expression, collaboration, and personal
                development. His mission is to empower individuals through
                movement and creativity.
              </p>
            </div>
            <div className="img-container">
              <img src={founder} alt="" />
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
        <div className="container">
          <h2>
            Meet Our Instructors <hr />
          </h2>

          <div className="instructors">
            <div className="instructor">
              <img src={yoga} alt="Instructor" />
              <h3>John Doe</h3>
              <p>Yoga Instructor</p>
            </div>
            <div className="instructor">
              <img src={yoga} alt="Instructor" />
              <h3>Jane Doe</h3>
              <p>Boxing Instructor</p>
            </div>
            <div className="instructor">
              <img src={yoga} alt="Instructor" />
              <h3>John Smith</h3>
              <p>Jiu-Jitsu Instructor</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
