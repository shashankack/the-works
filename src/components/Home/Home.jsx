import { useState, useEffect } from "react";
import "./Home.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Autoplay, Pagination } from "swiper/modules";

import carousel1 from "../../assets/desktop-carousel-1.jpg";
import carousel2 from "../../assets/desktop-carousel-2.jpg";
import carousel3 from "../../assets/desktop-carousel-3.jpg";

const Home = () => {
  const sliderContent = [
    {
      id: 1,
      title: "The Works",
      image: carousel1,
      text: "The Works represents an oasis of ideas in the heart of Bangalore. We are an open space  for curated movement, cultural and creative experiences. Our space is designed for intimate gatherings, curated events.",
      redirectLink: "/contact",
    },
    {
      id: 2,
      title: "The Works",
      image: carousel2,
      text: "The Works represents an oasis of ideas in the heart of Bangalore. We are an open space  for curated movement, cultural and creative experiences. Our space is designed for intimate gatherings, curated events.",
      redirectLink: "/",
    },
    {
      id: 3,
      title: "The Works",
      image: carousel3,
      text: "The Works represents an oasis of ideas in the heart of Bangalore. We are an open space  for curated movement, cultural and creative experiences. Our space is designed for intimate gatherings, curated events.",
      redirectLink: "/",
    },
  ];

  return (
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
              <img src={slide.image} alt={slide.title} />
              <div className="content">
                <h1>{slide.title}</h1>
                <p>{slide.text}</p>
                <button
                  className="cta-button"
                  onClick={() => {
                    window.location.href = slide.redirectLink;
                  }}
                >
                  View More
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default Home;
