// EditForm.jsx
import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Grid2,
  Snackbar,
  Alert,
  Box,
} from "@mui/material";
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
    recurrence: false,
    recurrenceRule: "",
    trainerId: "",
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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
        recurrence: !!initialData?.recurrence,
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
  }, [initialData, isClass]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setFormData((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;

    if (name === "thumbnail") {
      const file = files[0];
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
    } else {
      setImages([...files]);
      setImagePreviews((prev) => [
        ...prev,
        ...Array.from(files).map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleDeleteImage = async (imageUrl) => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;

    try {
      const response = await axiosInstance.delete(
        `/admin/${isClass ? "classes" : "events"}/${
          initialData.id
        }/delete-image`,
        { data: { imageUrl } }
      );

      if (response.data.success) {
        alert("Image deleted successfully!");
        setImagePreviews((prev) => prev.filter((img) => img !== imageUrl));
      } else {
        alert("Failed to delete image.");
      }
    } catch (error) {
      alert("Error deleting image.");
    }
  };

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
        if (value !== undefined && value !== null) {
          formPayload.append(
            key,
            typeof value === "boolean" ? value.toString() : value
          );
        }
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
      setSnackbarOpen(true);
    }
    setLoading(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="edit-form">
      <Typography variant="h4" gutterBottom>
        Edit {isClass ? "Class" : "Event"}
      </Typography>
      {error && (
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity="error">
            {error}
          </Alert>
        </Snackbar>
      )}
      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={3}>
          {/* Details Section */}
          <Grid2 item xs={12}>
            <Typography variant="h5">Details</Typography>
          </Grid2>

          <Grid2 item xs={12} sm={6}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid2>

          <Grid2 item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="eventStatus"
                value={formData.eventStatus}
                onChange={handleInputChange}
              >
                <MenuItem value="UPCOMING">Upcoming</MenuItem>
                <MenuItem value="ONGOING">Ongoing</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 item xs={12} sm={6}>
            <TextField
              label="Start Time"
              type="datetime-local"
              name="startDuration"
              value={formData.startDuration}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Grid2 item xs={12} sm={6}>
            <TextField
              label="End Time"
              type="datetime-local"
              name="endDuration"
              value={formData.endDuration}
              onChange={handleInputChange}
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
            />
          </Grid2>

          <Grid2 item xs={12} sm={6}>
            <FormControl>
              <Typography variant="subtitle1">Is Recurring?</Typography>
              <label
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <input
                  type="checkbox"
                  name="recurrence"
                  checked={formData.recurrence}
                  onChange={handleInputChange}
                />
                Enable Recurrence
              </label>
            </FormControl>
          </Grid2>

          {formData.recurrence && (
            <Grid2 item xs={12}>
              <TextField
                label="Recurrence Rule"
                name="recurrenceRule"
                value={formData.recurrenceRule}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid2>
          )}

          <Grid2 item xs={12} sm={6}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid2>

          <Grid2 item xs={12}>
            <TextField
              label="Concept Note"
              name="conceptNote"
              value={formData.conceptNote}
              onChange={handleInputChange}
              fullWidth
              multiline
              rows={4}
            />
          </Grid2>

          {isClass && (
            <Grid2 item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Class Type</InputLabel>
                <Select
                  name="classType"
                  value={formData.classType}
                  onChange={handleInputChange}
                >
                  <MenuItem value="one-to-one">One-to-One</MenuItem>
                  <MenuItem value="group">Group</MenuItem>
                </Select>
              </FormControl>
            </Grid2>
          )}

          {/* Media Section */}
          <Grid2 item xs={12}>
            <Typography variant="h5">Media</Typography>
          </Grid2>

          <Grid2 item xs={12} sm={6}>
            {thumbnailPreview && (
              <Box mb={1}>
                <Typography variant="subtitle1">Current Thumbnail:</Typography>
                <img
                  src={thumbnailPreview}
                  alt="Current Thumbnail"
                  style={{ maxWidth: "100%", height: "auto" }}
                />
              </Box>
            )}
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Grid2>

          <Grid2 item xs={12} sm={6}>
            {imagePreviews.length > 0 && (
              <Box mb={1}>
                <Typography variant="subtitle1">Current Images:</Typography>
                <Box display="flex" flexWrap="wrap" gap={1}>
                  {imagePreviews.map((img, index) => (
                    <Box
                      key={index}
                      textAlign="center"
                      className="image-wrapper"
                    >
                      <img
                        src={img}
                        alt={`Current Image ${index}`}
                        style={{ width: "100px", height: "auto" }}
                      />
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        onClick={() => handleDeleteImage(img)}
                      >
                        Delete
                      </Button>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </Grid2>

          {/* Action Buttons */}
          <Grid2 item xs={12}>
            <Box display="flex" justifyContent="flex-end" gap={2}>
              <Button variant="outlined" onClick={onCancel}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </Box>
          </Grid2>
        </Grid2>
      </form>
    </div>
  );
};

export default EditForm;
