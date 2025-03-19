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
    trainerId: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle file inputs for images & thumbnails
  const handleFileChange = (e) => {
    if (e.target.name === "thumbnail") {
      setThumbnail(e.target.files[0]); // Only one thumbnail
    } else {
      setImages(Array.from(e.target.files)); // Multiple images
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const endpoint = isClass ? "/admin/classes" : "/admin/events";
      const formPayload = new FormData();

      // Append form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formPayload.append(key, value);
      });

      // Append files (Thumbnail & Images)
      if (thumbnail) formPayload.append("thumbnail", thumbnail);
      images.forEach((image) => formPayload.append("images", image));

      // ✅ Send everything in ONE request
      const response = await axiosInstance.post(endpoint, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) {
        throw new Error("Failed to create");
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

        <label>Trainer ID:</label>
        <input
          type="number"
          name="trainerId"
          value={formData.trainerId}
          onChange={handleInputChange}
        />

        <label>Thumbnail:</label>
        <input
          type="file"
          name="thumbnail"
          accept="image/*"
          onChange={handleFileChange}
        />

        <label>Upload Multiple Images:</label>
        <input
          type="file"
          name="images"
          accept="image/*"
          multiple
          onChange={handleFileChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating..." : `Create ${isClass ? "Class" : "Event"}`}
        </button>
      </form>
    </div>
  );
};

export default CreateForm;
