import { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./CreateForm.scss";

const CreateForm = ({ isClass = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDuration: "",
    endDuration: "",
    eventStatus: "UPCOMING",
    location: "",
    conceptNote: "",
    classType: isClass ? "one-to-one" : "",
    recurrenceRule: "",
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    if (e.target.name === "thumbnail") {
      setThumbnail(e.target.files[0]);
    } else {
      setImages([...e.target.files]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      // Create Event or Class
      const response = await axiosInstance.post(
        isClass ? "/admin/classes" : "/admin/events",
        formData
      );
      const itemId = response.data.newEvent?.id || response.data.newClass?.id;

      // Upload images
      if (itemId) {
        const formDataImages = new FormData();
        if (isClass) {
          formDataImages.append("classId", itemId);
        } else {
          formDataImages.append("eventId", itemId);
        }
        formDataImages.append("thumbnail", thumbnail);
        images.forEach((image) => formDataImages.append("images", image));

        await axiosInstance.post("/admin/upload-images", formDataImages, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      setMessage(`${isClass ? "Class" : "Event"} created successfully!`);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          `Failed to create ${isClass ? "class" : "event"}`
      );
    }
    setLoading(false);
  };

  return (
    <div className="create-form">
      <h2>Create {isClass ? "Class" : "Event"}</h2>
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
          required
        />

        <label>Start Time:</label>
        <input
          type="datetime-local"
          name="startDuration"
          value={formData.startDuration}
          onChange={handleInputChange}
          required
        />

        <label>End Time:</label>
        <input
          type="datetime-local"
          name="endDuration"
          value={formData.endDuration}
          onChange={handleInputChange}
          required
        />

        <label>Status:</label>
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

        <label>Location:</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleInputChange}
        />

        <label>Concept Note:</label>
        <textarea
          name="conceptNote"
          value={formData.conceptNote}
          onChange={handleInputChange}
        />

        {isClass && (
          <>
            <label>Class Type:</label>
            <select
              name="classType"
              value={formData.classType}
              onChange={handleInputChange}
            >
              <option value="one-to-one">One-to-One</option>
              <option value="group">Group</option>
            </select>
          </>
        )}

        <label>Thumbnail:</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleFileChange}
          required
        />

        <label>Upload Multiple Images:</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleFileChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : `Create ${isClass ? "Class" : "Event"}`}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
