import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { logout } from "../../utils/auth";
import CreateForm from "../../components/Dashboard/CreateForm/CreateForm"; // Import reusable CreateForm
import "./Dashboard.scss";

const Dashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [errors, setErrors] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isCreatingClass, setIsCreatingClass] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/admin/login"; // Redirect if not logged in
      return;
    }

    // Fetch events & classes
    axiosInstance
      .get("/events")
      .then((res) => setEvents(res.data.events))
      .catch((err) =>
        setErrors(err.response?.data?.error || "Error fetching events")
      );

    axiosInstance
      .get("/classes")
      .then((res) => setClasses(res.data.classes))
      .catch((err) =>
        setErrors(err.response?.data?.error || "Error fetching classes")
      );
  }, []);

  return (
    <div className="admin-dashboard">
      <div className="main-content">
        {/* Navbar */}
        <header className="navbar">
          <h1>Dashboard</h1>
          <button onClick={logout}>Logout</button>
        </header>

        {/* Events/Classes Count */}
        <div className="overview">
          <div className="card">
            <h3>Total Events</h3>
            <p>{events.length}</p>
          </div>
          <div className="card">
            <h3>Total Classes</h3>
            <p>{classes.length}</p>
          </div>
        </div>

        {/* Event List */}
        <section className="list-section">
          <h2>Upcoming Events</h2>
          <button
            className="create-btn"
            onClick={() => {
              setShowModal(true);
              setIsCreatingClass(false);
            }}
          >
            + Create Event
          </button>
          <ul className="list">
            {events.map((event) => (
              <li key={event.id}>
                <button
                  className="clickable"
                  onClick={() => navigate(`/admin/events/${event.id}`)}
                >
                  {event.title} - {event.eventStatus}
                </button>
              </li>
            ))}
          </ul>
        </section>

        {/* Class List */}
        <section className="list-section">
          <h2>Upcoming Classes</h2>
          <button
            className="create-btn"
            onClick={() => {
              setShowModal(true);
              setIsCreatingClass(true);
            }}
          >
            + Create Class
          </button>
          <ul className="list">
            {classes.map((cls) => (
              <li key={cls.id}>
                <button
                  className="clickable"
                  onClick={() => navigate(`/admin/classes/${cls.id}`)}
                >
                  {cls.title} - {cls.eventStatus}
                </button>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Full-Screen Modal for Creating Events/Classes */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowModal(false)}>
              ✖
            </button>
            <CreateForm isClass={isCreatingClass} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
