import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import "./EditForm.scss";

const EditForm = ({ initialData, isClass = false, onSave, onCancel }) => {
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
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load initialData when component mounts
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData?.title || "",
        startDuration: initialData?.startDuration || "",
        endDuration: initialData?.endDuration || "",
        eventStatus: initialData?.eventStatus || "UPCOMING",
        location: initialData?.location || "",
        conceptNote: initialData?.conceptNote || "",
        classType: initialData?.classType || (isClass ? "one-to-one" : ""),
        recurrenceRule: initialData?.recurrenceRule || "",
        trainerId: initialData?.trainer?.id || "",
      });

      if (initialData.thumbnail) setThumbnailPreview(initialData.thumbnail);

      let parsedImages = [];
      if (typeof initialData.imageUrls === "string") {
        try {
          parsedImages = JSON.parse(initialData.imageUrls);
        } catch (error) {
          console.error("❌ Error parsing imageUrls:", error);
        }
      } else if (Array.isArray(initialData.imageUrls)) {
        parsedImages = initialData.imageUrls;
      }

      setImages([]);
      setImagePreviews(parsedImages);
    }
  }, [initialData]);

  // ✅ Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // ✅ Handle file input changes
  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "thumbnail") {
      const file = files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setImages([...files]);
      setImagePreviews([
        ...imagePreviews,
        ...Array.from(files).map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  // ✅ Handle deleting an image
  const handleDeleteImage = async (imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await axiosInstance.delete(
        `/admin/${isClass ? "classes" : "events"}/${initialData.id}/delete-image`,
        { data: { imageUrl } }
      );

      if (response.data.success) {
        alert("Image deleted successfully!");

        // ✅ Remove from UI
        setImagePreviews((prevImages) => prevImages.filter((img) => img !== imageUrl));
      } else {
        alert("Failed to delete image.");
      }
    } catch (error) {
      alert("Error deleting image.");
    }
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const endpoint = isClass
        ? `/admin/classes/${initialData?.id}`
        : `/admin/events/${initialData?.id}`;
      const formPayload = new FormData();

      Object.entries(formData).forEach(([key, value]) => {
        if (value) formPayload.append(key, value);
      });

      if (thumbnail) formPayload.append("thumbnail", thumbnail);
      images.forEach((image) => formPayload.append("images", image));

      const response = await axiosInstance.put(endpoint, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) throw new Error("Failed to update");

      onSave(response.data.class || response.data.event);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update.");
    }
    setLoading(false);
  };

  return (
    <div className="edit-form">
      <h2>Edit {isClass ? "Class" : "Event"}</h2>
      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <label>Title:</label>
        <input type="text" name="title" value={formData.title} onChange={handleInputChange} required />

        <label>Start Time:</label>
        <input type="datetime-local" name="startDuration" value={formData.startDuration} onChange={handleInputChange} required />

        <label>End Time:</label>
        <input type="datetime-local" name="endDuration" value={formData.endDuration} onChange={handleInputChange} required />

        <label>Status:</label>
        <select name="eventStatus" value={formData.eventStatus} onChange={handleInputChange}>
          <option value="UPCOMING">Upcoming</option>
          <option value="ONGOING">Ongoing</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>

        <label>Location:</label>
        <input type="text" name="location" value={formData.location} onChange={handleInputChange} />

        <label>Concept Note:</label>
        <textarea name="conceptNote" value={formData.conceptNote} onChange={handleInputChange} />

        {isClass && (
          <>
            <label>Class Type:</label>
            <select name="classType" value={formData.classType} onChange={handleInputChange}>
              <option value="one-to-one">One-to-One</option>
              <option value="group">Group</option>
            </select>
          </>
        )}

        {thumbnailPreview && (
          <div className="current-thumbnail">
            <p>Current Thumbnail:</p>
            <img src={thumbnailPreview} alt="Current Thumbnail" />
          </div>
        )}
        <label>New Thumbnail:</label>
        <input type="file" name="thumbnail" accept="image/*" onChange={handleFileChange} />

        {imagePreviews.length > 0 && (
          <div className="current-images">
            <p>Current Images:</p>
            <div className="image-grid">
              {imagePreviews.map((img, index) => (
                <div key={index} className="image-wrapper">
                  <img src={img} alt={`Current Image ${index}`} />
                  <button className="delete-image-btn" onClick={() => handleDeleteImage(img)}>❌</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <label>Upload New Images:</label>
        <input type="file" name="images" accept="image/*" multiple onChange={handleFileChange} />

        <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
        <button type="button" onClick={onCancel} className="cancel-btn">Cancel</button>
      </form>
    </div>
  );
};

export default EditForm;
