import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./EventsSection.scss";

const EventsSection = ({ classesData, eventsData }) => {
  const [activeTab, setActiveTab] = useState("classes");

  const data = activeTab === "classes" ? classesData : eventsData;

  return (
    <section className="events-section">
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
            {data.map((item) => (
              <SwiperSlide key={item.id}>
                <div className="card">
                  <img src={item.image} alt={item.title} />
                  <h3>{item.title}</h3>
                  <a className="cta-button" href={item.redirect}>
                    Read More
                  </a>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default EventsSection;
