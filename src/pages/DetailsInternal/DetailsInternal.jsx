import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import EditForm from "../../components/Forms/EditForm";

const DetailsInternal = ({ isClass }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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

        setItem({ ...fetchedItem, images });
        setLoading(false);
      })
      .catch((err) => {
        setError(err.response?.data?.error || "Not found");
        setLoading(false);
      });
      console.log(fetchedItem)
  }, [id, isClass]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete this ${isClass ? "class" : "event"}?`
      )
    )
      return;

    setDeleteLoading(true);
    try {
      await axiosInstance.delete(
        `/admin/${isClass ? "classes" : "events"}/${id}`
      );
      alert(`${isClass ? "Class" : "Event"} deleted successfully!`);
      navigate("/admin"); // Redirect to dashboard
    } catch (err) {
      alert("Failed to delete.");
    }
    setDeleteLoading(false);
  };

  const handleEditSuccess = (updatedItem) => {
    setItem(updatedItem);
    setShowEditModal(false);
  };

  return (
    <div className="details-internal">
      <div className="top-buttons">
        <button onClick={() => navigate(-1)} className="back-btn">
          ⬅ Back
        </button>
        <button onClick={() => setShowEditModal(true)} className="edit-btn">
          ✏️ Edit
        </button>
        <button
          onClick={handleDelete}
          className="delete-btn"
          disabled={deleteLoading}
        >
          {deleteLoading ? "Deleting..." : "🗑 Delete"}
        </button>
      </div>

      {loading ? (
        <p className="loading">⏳ Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : item ? (
        <div className="item-card">
          {item.thumbnail && (
            <div className="thumbnail-container">
              <img src={item.thumbnail} alt="Thumbnail" className="thumbnail" />
            </div>
          )}

          <h1>{item.title}</h1>
          <p>
            <strong>Status:</strong> {item.eventStatus}
          </p>
          <p>
            <strong>Location:</strong> {item.location}
          </p>
          <p>
            <strong>Start Time:</strong> {item.startDuration || "N/A"}
          </p>
          <p>
            <strong>End Time:</strong> {item.endDuration || "N/A"}
          </p>
          <p>
            <strong>Recurrence:</strong> {item.recurrenceRule || "One-time"}
          </p>

          {/* Concept Note rendered as HTML */}
          <div>
            <strong>Description:</strong>
            <div
              className="concept-note"
              dangerouslySetInnerHTML={{ __html: item.conceptNote || "<p>No description available.</p>" }}
            />
          </div>

          {/* Instructions rendered as HTML */}
          <div>
            <strong>Instructions:</strong>
            <div
              className="instructions"
              dangerouslySetInnerHTML={{ __html: item.instructions || "<p>No instructions provided.</p>" }}
              style={{ marginTop: "0.5rem", whiteSpace: "pre-line" }}
            />
          </div>

          {item.trainer && (
            <div className="trainer-details" style={{ marginTop: "1rem" }}>
              <h3>Trainer</h3>
              <p>
                <strong>Name:</strong> {item.trainer.name}
              </p>
              <p>
                <strong>Phone:</strong> {item.trainer.phone || "Not provided"}
              </p>
              <p>
                <strong>Specialization:</strong>{" "}
                {item.trainer.specialization || "Not provided"}
              </p>
            </div>
          )}

          {/* Display Multiple Images */}
          {item.images.length > 0 && (
            <div className="images-container" style={{ marginTop: "1rem" }}>
              <h3>Images</h3>
              <div className="image-grid" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {item.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Image ${index + 1}`}
                    className="image"
                    style={{ width: 150, height: 150, objectFit: "cover", borderRadius: 4 }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <p className="error">Not found</p>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowEditModal(false)}>
              ✖
            </button>
            <EditForm
              initialData={item}
              isClass={isClass}
              onSave={handleEditSuccess}
              onCancel={() => setShowEditModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DetailsInternal;
