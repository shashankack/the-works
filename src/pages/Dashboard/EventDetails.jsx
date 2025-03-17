import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./EventDetails.scss";
import LoadingScreen from "../../components/Loader";

const EventDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(true); // Open edit mode by default
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axiosInstance
      .get(`/events/${id}`)
      .then((res) => {
        setEvent(res.data.event);
        setFormData(res.data.event); 
      })
      .catch((err) => setError(err.response?.data?.error || "Event not found"));
  }, [id]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await axiosInstance.put(`/events/${id}`, formData);
      setEvent(formData);
      navigate(-1);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update event");
    }
    setLoading(false);
  };

  return (
    <div className="event-details">
      {error ? (
        <p className="error">{error}</p>
      ) : event ? (
        <div className="event-card">
          <h1>Edit Event</h1>

          <label>
            <strong>Status:</strong>
            <select
              name="eventStatus"
              value={formData.eventStatus}
              onChange={handleInputChange}
            >
              <option value="UPCOMING">Upcoming</option>
              <option value="ONGOING">Ongoing</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </label>

          <label>
            <strong>Location:</strong>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
            />
          </label>

          <label>
            <strong>Start Time:</strong>
            <input
              type="datetime-local"
              name="startDuration"
              value={formData.startDuration}
              onChange={handleInputChange}
            />
          </label>

          <label>
            <strong>End Time:</strong>
            <input
              type="datetime-local"
              name="endDuration"
              value={formData.endDuration}
              onChange={handleInputChange}
            />
          </label>

          <label>
            <strong>Description:</strong>
            <textarea
              name="conceptNote"
              value={formData.conceptNote}
              onChange={handleInputChange}
            />
          </label>

          <div className="button-group">
            <button onClick={() => navigate(-1)} className="back-btn">
              ⬅ Back
            </button>
            <button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
};

export default EventDetails;
