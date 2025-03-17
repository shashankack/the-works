import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import "./ClassDetails.scss";

const ClassDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cls, setClass] = useState(null);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axiosInstance
      .get(`/classes/${id}`)
      .then((res) => {
        setClass(res.data.class);
        setImages(res.data.class.images || []);
      })
      .catch((err) => setError(err.response?.data?.error || "Class not found"));
  }, [id]);

  return (
    <div className="class-details">
      <button onClick={() => navigate(-1)} className="back-btn">
        ⬅ Back
      </button>
      
      {error ? (
        <p className="error">{error}</p>
      ) : cls ? (
        <div className="class-card">
          {/* Display Thumbnail */}
          {cls.thumbnail && (
            <div className="thumbnail-container">
              <h3>Thumbnail</h3>
              <img src={cls.thumbnail} alt="Class Thumbnail" className="thumbnail" />
            </div>
          )}

          <h1>{cls.title}</h1>
          <p>
            <strong>Status:</strong> {cls.eventStatus}
          </p>
          <p>
            <strong>Location:</strong> {cls.location}
          </p>
          <p>
            <strong>Start Time:</strong> {cls.startDuration}
          </p>
          <p>
            <strong>End Time:</strong> {cls.endDuration}
          </p>
          <p>
            <strong>Class Type:</strong> {cls.classType}
          </p>
          <p>
            <strong>Recurrence:</strong> {cls.recurrenceRule || "One-time"}
          </p>
          <p>
            <strong>Description:</strong> {cls.conceptNote || "No description available"}
          </p>

          {/* Display Trainer Details */}
          {cls.trainer && (
            <div className="trainer-details">
              <h3>Trainer</h3>
              <p><strong>Name:</strong> {cls.trainer.name}</p>
              <p><strong>Phone:</strong> {cls.trainer.phone || "Not provided"}</p>
              <p><strong>Specialization:</strong> {cls.trainer.specialization || "Not provided"}</p>
            </div>
          )}

          {/* Display Multiple Images */}
          {images.length > 0 && (
            <div className="images-container">
              <h3>Class Images</h3>
              <div className="image-grid">
                {images.map((image, index) => (
                  <img key={index} src={image} alt={`Class Image ${index}`} className="class-image" />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ClassDetails;
