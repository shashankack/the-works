import { useState, useEffect } from "react";
import "./Home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay } from "swiper/modules";

import desktopCarousel1 from "../../assets/desktop-carousel-1.jpg";
import desktopCarousel2 from "../../assets/desktop-carousel-2.jpg";
import desktopCarousel3 from "../../assets/desktop-carousel-3.jpg";
import mobileCarousel1 from "../../assets/mobile-carousel-1.jpg";
import mobileCarousel2 from "../../assets/mobile-carousel-2.jpg";
import mobileCarousel3 from "../../assets/mobile-carousel-3.jpg";

import bjjImg from "../../assets/card_bjj.jpg";
import pilatesImg from "../../assets/card_pilates.jpg";
import strengthTrainingImg from "../../assets/card_strengthtraining.jpg";
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

  const sliderContent = [
    {
      id: 1,
      title: "Welcome to The Works",
      desktop: desktopCarousel1,
      mobile: mobileCarousel1,
      text: "Tucked away in a lush, green oasis in the heart of Bangalore, The Works is a vibrant space where movement, culture, and creativity come alive.",
      redirectLink: "/contact",
    },
    {
      id: 2,
      title: "The Works",
      desktop: desktopCarousel2,
      mobile: mobileCarousel2,
      text: "",
      redirectLink: "/",
    },
    {
      id: 3,
      title: "The Works",
      desktop: desktopCarousel3,
      mobile: mobileCarousel3,
      text: "",
      redirectLink: "/",
    },
  ];

  const mockData = {
    classes: [
      {
        id: 1,
        title: "WICK3D Jiu-Jutsu: Women's Collection",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: bjjImg,
        redirect:
          "https://shashankdev.dayschedule.com/wick3d-jiu-jutsu-womens-collection",
      },
      {
        id: 2,
        title: "Pilates",
        description:
          "Pilate is a physical fitness system developed in the early 20th century by Joseph Pilates, after whom it was named.",
        image: pilatesImg,
      },
      {
        id: 3,
        title: "Strength Training",
        description:
          "Strength training is a type of physical exercise specializing in the use of resistance to induce muscular contraction which builds the strength, anaerobic endurance, and size of skeletal muscles.",
        image: strengthTrainingImg,
      },
      {
        id: 1,
        title: "WICK3D Jiu-Jutsu: Women's Collection",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: bjjImg,
        redirect:
          "https://shashankdev.dayschedule.com/wick3d-jiu-jutsu-womens-collection",
      },
      {
        id: 2,
        title: "Advanced Jiujitsu",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: pilatesImg,
      },
      {
        id: 3,
        title: "Kickboxing Workout",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: strengthTrainingImg,
      },
      {
        id: 3,
        title: "Kickboxing Workout",
        description:
          "Dedicated to creating a supportive and empowering space for women to learn, grow, and thrive through Brazilian Jiu-Jitsu.",
        image: pilatesImg,
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
        <Swiper
          modules={[Autoplay]}
          loop={true}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{ delay: 6000 }}
        >
          {sliderContent.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div className="container">
                <img
                  src={isMobile ? slide.desktop : slide.mobile}
                  alt={slide.title}
                />
                <div className="content">
                  <h1>{slide.title}</h1>
                  <p>{slide.text}</p>
                  <a
                    className="cta-button"
                    onClick={() => {
                      window.location.href = slide.redirectLink;
                    }}
                  >
                    View More
                  </a>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
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
        </div>
      </section>

      <section className="upcoming-events-section">
        <div className="container">
          <h2>Upcoming {activeTab === "classes" ? "Classes" : "Events"}</h2>

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
            {activeTab === "classes" ? (
              <div className="class-container">
                <div className="left">Some content here.</div>
                <div className="right">
                  {mockData[activeTab].map((item) => (
                    <div className="cards">
                      <div className="card">
                        <img src={item.image} alt="" />
                        <h3>{item.title}</h3>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              mockData[activeTab].map((item) => (
                <div key={item.id} className="event-card">
                  <img src={item.image} alt={item.title} />
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <button
                    onClick={() => (window.location.href = item.redirect)}
                  >
                    View Details
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      <section className="instructors-section">
        <div className="container">
          <h2>
            Meet Our Instructors <hr />{" "}
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
