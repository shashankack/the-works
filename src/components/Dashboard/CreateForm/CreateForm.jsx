import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  Alert,
  Grid2,
} from "@mui/material";
import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import RecurrencePopup from "../../ReccurencePopup/ReccurencePopup";

const CreateForm = ({ isClass = false }) => {
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
    totalSeats: 0,
    availableSeats: 0,
  });

  const [thumbnail, setThumbnail] = useState(null);
  const [images, setImages] = useState([]);
  const [recurrenceDialogOpen, setRecurrenceDialogOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const fetchTrainers = async () => {
      try {
        const res = await axiosInstance.get("/admin/trainers");
        setTrainers(res.data.trainers || []);
      } catch (err) {
        console.error("Failed to fetch trainers", err);
      }
    };
    fetchTrainers();
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.name === "thumbnail") {
      setThumbnail(e.target.files[0]);
    } else {
      setImages(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const endpoint = isClass ? "/admin/classes" : "/admin/events";
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
      images.forEach((img) => formPayload.append("images", img));

      const res = await axiosInstance.post(endpoint, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!res.data.success) throw new Error("Creation failed");

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
    <Box sx={{ maxWidth: 700, margin: "auto", p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Create {isClass ? "Class" : "Event"}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {message && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      <form onSubmit={handleSubmit}>
        <Grid2 container spacing={2}>
          <Grid2 item xs={12}>
            <TextField
              label="Title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              fullWidth
              required
            />
          </Grid2>

          <Grid2 item xs={6}>
            <TextField
              label="Start Time"
              type="datetime-local"
              name="startDuration"
              value={formData.startDuration}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid2>

          <Grid2 item xs={6}>
            <TextField
              label="End Time"
              type="datetime-local"
              name="endDuration"
              value={formData.endDuration}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
            />
          </Grid2>

          <Grid2 item xs={6}>
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

          {isClass && (
            <Grid2 item xs={6}>
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

          <Grid2 item xs={6}>
            <TextField
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid2>

          <FormControl fullWidth>
            <InputLabel>Trainer</InputLabel>
            <Select
              name="trainerId"
              value={formData.trainerId}
              onChange={handleInputChange}
            >
              {trainers.map((trainer) => (
                <MenuItem key={trainer.id} value={trainer.id}>
                  {trainer.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Grid2 item xs={6}>
            <TextField
              label="Total Seats"
              name="totalSeats"
              type="number"
              value={formData.totalSeats}
              onChange={handleInputChange}
              fullWidth
            />
          </Grid2>

          <Grid2 item xs={6}>
            <TextField
              label="Available Seats"
              name="availableSeats"
              type="number"
              value={formData.availableSeats}
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
              multiline
              rows={3}
              fullWidth
            />
          </Grid2>

          <Grid2 item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.recurrence}
                  onChange={handleInputChange}
                  name="recurrence"
                />
              }
              label="Is this recurring?"
            />
          </Grid2>

          {formData.recurrence && (
            <Grid2 item xs={12}>
              <Button
                variant="outlined"
                onClick={() => setRecurrenceDialogOpen(true)}
              >
                Set Recurrence Rule
              </Button>

              {formData.recurrenceRule && (
                <Box mt={1} sx={{ whiteSpace: "pre-wrap", fontSize: 12 }}>
                  <strong>Recurrence Rule:</strong>
                  <pre>{formData.recurrenceRule}</pre>
                </Box>
              )}

              <RecurrencePopup
                open={recurrenceDialogOpen}
                onClose={() => setRecurrenceDialogOpen(false)}
                onSave={(rule) => {
                  setFormData((prev) => ({
                    ...prev,
                    recurrenceRule: JSON.stringify(rule),
                  }));
                }}
                initialValue={
                  formData.recurrenceRule
                    ? JSON.parse(formData.recurrenceRule)
                    : {}
                }
              />
            </Grid2>
          )}

          <Grid2 item xs={12}>
            <label>Thumbnail:</label>
            <input
              type="file"
              name="thumbnail"
              accept="image/*"
              onChange={handleFileChange}
            />
          </Grid2>

          <Grid2 item xs={12}>
            <label>Upload Multiple Images:</label>
            <input
              type="file"
              name="images"
              accept="image/*"
              multiple
              onChange={handleFileChange}
            />
          </Grid2>

          <Grid2 item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : `Create ${isClass ? "Class" : "Event"}`}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </Box>
  );
};

export default CreateForm;
