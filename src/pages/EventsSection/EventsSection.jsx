import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./EventsSection.scss";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material";
import axiosInstance from "../../utils/axiosInstance";
import LoadingScreen from "../../components/Loader";

const EventsSection = () => {
  const [activeTab, setActiveTab] = useState("classes");
  const [classesData, setClassesData] = useState([]);
  const [eventsData, setEventsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [classesError, setClassesError] = useState(null);
  const [eventsError, setEventsError] = useState(null);

  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesResponse, eventsResponse] = await Promise.all([
          axiosInstance.get("/classes"),
          axiosInstance.get("/events"),
        ]);

        if (classesResponse.data?.error)
          setClassesError(classesResponse.data.error);
        else setClassesData(classesResponse.data.classes || []);

        if (eventsResponse.data?.error)
          setEventsError(eventsResponse.data.error);
        else setEventsData(eventsResponse.data.events || []);
      } catch (error) {
        setClassesError("No classes at the moment");
        setEventsError("No Events at the moment");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const isClassesTab = activeTab === "classes";
  const data = isClassesTab ? classesData : eventsData;
  const errorMessage = isClassesTab ? classesError : eventsError;

  const handleRedirect = (item, type) => {
    navigate(`/${type}/${item.id}`);
    window.scrollTo(0, 0);
  };

  return (
    <section
      className="events-section"
      style={{ backgroundColor: theme.colors.beige }}
    >
      <div className="container">
        {/* Heading */}
        <div className="heading">
          <h2 style={{ color: theme.colors.tertiary }}>
            Upcoming {isClassesTab ? "Classes" : "Events"}
            <hr
              style={{
                border: `1px solid ${theme.colors.tertiary}`,
                width: "50%",
                marginTop: "0.5rem",
              }}
            />
          </h2>
        </div>

        {/* Tabs */}
        <div className="tabs">
          <button
            className={isClassesTab ? "active" : ""}
            onClick={() => setActiveTab("classes")}
            style={{
              backgroundColor: isClassesTab
                ? theme.colors.tertiary
                : theme.colors.beige,
              color: isClassesTab ? theme.colors.beige : theme.colors.tertiary,
              border: `1px solid ${theme.colors.tertiary}`,
            }}
          >
            Classes
          </button>
          <hr />
          <button
            className={!isClassesTab ? "active" : ""}
            onClick={() => setActiveTab("events")}
            style={{
              backgroundColor: !isClassesTab
                ? theme.colors.tertiary
                : theme.colors.beige,
              color: !isClassesTab ? theme.colors.beige : theme.colors.tertiary,
              border: `1px solid ${theme.colors.tertiary}`,
            }}
          >
            Events
          </button>
        </div>

        {/* Loading, Error, or No Data Message */}
        {loading ? (
          <LoadingScreen />
        ) : errorMessage && data.length === 0 ? (
          <p style={{ textAlign: "center", color: "red" }}>{errorMessage}</p>
        ) : data.length === 0 ? (
          <p style={{ textAlign: "center", color: theme.colors.tertiary }}>
            No {isClassesTab ? "Classes" : "Events"} Available
          </p>
        ) : (
          <div className="events">
            <Swiper
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 10 },
                640: { slidesPerView: 2, spaceBetween: 20 },
                768: { slidesPerView: 3, spaceBetween: 30 },
                1024: { slidesPerView: 3, spaceBetween: 40 },
              }}
              loop={true}
              grabCursor={true}
              modules={[FreeMode, Pagination, Navigation]}
              pagination={{ clickable: true }}
              freeMode={true}
              navigation={true}
              style={{ padding: "20px" }}
            >
              {data.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="card">
                    <div className="circle-image">
                      {item.thumbnail ? (
                        <img src={item.thumbnail} alt={item.title} />
                      ) : (
                        <div className="placeholder"></div>
                      )}
                    </div>
                    <h3>{item.title}</h3>
                    <button
                      className="cta-button"
                      style={{
                        backgroundColor: theme.colors.orange,
                        color: "#fff",
                        border: `2px solid ${theme.colors.orange}`,
                      }}
                      onClick={() => handleRedirect(item, activeTab)}
                    >
                      {isClassesTab ? "Book Class" : "Book Event"}
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
};

export default EventsSection;
