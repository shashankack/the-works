import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./Details.scss";

const Details = ({ isClass }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    instaHandle: "",
  });
  const [formError, setFormError] = useState("");
  const [formSuccess, setFormSuccess] = useState("");

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    axiosInstance
      .get(`/${isClass ? "classes" : "events"}/${id}`)
      .then((res) => {
        const fetchedItem = res.data.class || res.data.event;

        let images = [];
        if (fetchedItem.imageUrls) {
          try {
            images = Array.isArray(fetchedItem.imageUrls)
              ? fetchedItem.imageUrls
              : JSON.parse(fetchedItem.imageUrls);
          } catch (error) {
            console.error("❌ Error parsing imageUrls:", error);
            images = [];
          }
        }

        setData({ ...fetchedItem, images });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Not found");
        setLoading(false);
      });
  }, [id, isClass]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    const { name, email, phone } = formData;
    if (!name || !email || !phone) {
      setFormError("Name, Email and Phone are required.");
      return;
    }

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        instaHandle: formData.instaHandle || null,
      };

      const endpoint = `/${isClass ? "classes" : "events"}/${id}/register`;
      await axiosInstance.post(endpoint, payload);

      setFormSuccess("Registration successful!");
      setFormData({
        name: "",
        email: "",
        phone: "",
        instaHandle: "",
      });

      setTimeout(() => {
        setShowForm(false);
        setFormSuccess("");
      }, 1500);
    } catch (err) {
      setFormError(
        err.response?.data?.error || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="details-internal">
      <div className="top-buttons">
        <button onClick={() => navigate(-1)} className="back-btn">
          ⬅ Back
        </button>
      </div>

      {loading ? (
        <p className="loading">⏳ Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : data ? (
        <div className="data-card">
          {data.thumbnail && (
            <div className="thumbnail-container">
              <img src={data.thumbnail} alt="Thumbnail" className="thumbnail" />
            </div>
          )}
          <h1>{data.title}</h1>
          <p>
            <strong>Status:</strong> {data.eventStatus}
          </p>
          <p>
            <strong>Location:</strong> {data.location}
          </p>
          <p>
            <strong>Start Time:</strong> {data.startDuration}
          </p>
          <p>
            <strong>End Time:</strong> {data.endDuration}
          </p>
          <p>
            <strong>Recurrence:</strong>{" "}
            {data.recurrence ? (
              <pre className="recurrence-json">
                {JSON.stringify(
                  typeof data.recurrenceRule === "string"
                    ? JSON.parse(data.recurrenceRule)
                    : data.recurrenceRule,
                  null,
                  2
                )}
              </pre>
            ) : (
              "One-time"
            )}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {data.conceptNote || "No description available"}
          </p>

          {data.trainer && (
            <div className="trainer-details">
              <h3>Trainer</h3>
              <p>
                <strong>Name:</strong> {data.trainer.name}
              </p>
              <p>
                <strong>Phone:</strong> {data.trainer.phone || "Not provided"}
              </p>
              <p>
                <strong>Specialization:</strong>{" "}
                {data.trainer.specialization || "Not provided"}
              </p>
            </div>
          )}

          {data.images.length > 0 && (
            <div className="images-container">
              <h3>Images</h3>
              <div className="image-grid">
                {data.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index}`}
                    className="image"
                  />
                ))}
              </div>
            </div>
          )}

          <button className="register-button" onClick={() => setShowForm(true)}>
            REGISTER
          </button>

          {showForm && (
            <div className="popup-form-overlay">
              <div className="popup-form">
                <h2>Register</h2>
                {formError && <p className="error">{formError}</p>}
                {formSuccess && <p className="success">{formSuccess}</p>}
                <form onSubmit={handleSubmit}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="text"
                    name="instaHandle"
                    placeholder="Instagram Handle (optional)"
                    value={formData.instaHandle}
                    onChange={handleChange}
                  />
                  <button type="submit">Submit</button>
                  <button type="button" onClick={() => setShowForm(false)}>
                    Cancel
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="error">Not found</p>
      )}
    </div>
  );
};

export default Details;
