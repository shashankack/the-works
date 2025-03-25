// CreateForm as a Dialog popup with 1200px width and 800px height and scrollable content

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Alert,
  Checkbox,
  FormControlLabel,
  Box,
  Stack,
  Grid2,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";
import { useState, useEffect } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import RecurrencePopup from "../../ReccurencePopup/ReccurencePopup";
import RichTextEditor from "react-rte";
import AddIcon from "@mui/icons-material/Add";

const StyledDialogContent = styled(DialogContent)({
  height: "680px",
  overflowY: "auto",
});

const CreateForm = ({ open, onClose, isClass = false }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDuration: "",
    endDuration: "",
    eventStatus: "UPCOMING",
    location: "",
    conceptNote: "",
    instructions: "",
    classType: isClass ? "one-to-one" : "",
    recurrence: false,
    recurrenceRule: "",
    trainerId: "",
    totalSeats: 0,
    registrationFee: 0,
    addOnFees: [],
  });

  const [conceptNoteEditor, setConceptNoteEditor] = useState(
    RichTextEditor.createEmptyValue()
  );
  const [instructionsEditor, setInstructionsEditor] = useState(
    RichTextEditor.createEmptyValue()
  );
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
    const { name, files } = e.target;
    if (name === "thumbnail") setThumbnail(files[0]);
    else setImages(Array.from(files));
  };

  const handleAddOnChange = (index, field, value) => {
    const updated = [...formData.addOnFees];
    updated[index][field] = field === "price" ? Number(value) : value;
    setFormData({ ...formData, addOnFees: updated });
  };

  const addAddOnItem = () => {
    setFormData({
      ...formData,
      addOnFees: [...formData.addOnFees, { name: "", price: 0 }],
    });
  };

  const removeAddOnItem = (index) => {
    const updated = [...formData.addOnFees];
    updated.splice(index, 1);
    setFormData({ ...formData, addOnFees: updated });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setMessage(null);
    setError(null);
    onClose();

    try {
      const endpoint = isClass ? "/admin/classes" : "/admin/events";
      const formPayload = new FormData();
      const submissionData = {
        ...formData,
        availableSeats: formData.totalSeats,
        conceptNote: conceptNoteEditor.toString("html"),
        instructions: instructionsEditor.toString("html"),
      };

      Object.entries(submissionData).forEach(([key, value]) => {
        if (key === "addOnFees")
          formPayload.append("add_on_fees", JSON.stringify(value));
        else if (value !== undefined && value !== null)
          formPayload.append(
            key,
            typeof value === "boolean" ? value.toString() : value
          );
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
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        sx: {
          width: "800px",
          height: "800px",
          borderRadius: 2,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        Create {isClass ? "Class" : "Event"}
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <StyledDialogContent>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={4}>
            <Grid2 container spacing={2}>
              <Grid2 size={{ md: 6, sm: 12 }}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid2>
              <Grid2 size={{ md: 6, sm: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="eventStatus"
                    value={formData.eventStatus}
                    onChange={handleInputChange}
                    label="Status"
                  >
                    {["UPCOMING", "ONGOING", "COMPLETED", "CANCELLED"].map(
                      (status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      )
                    )}
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ md: 6, sm: 12 }}>
                <TextField
                  fullWidth
                  label="Start Time"
                  type="datetime-local"
                  name="startDuration"
                  value={formData.startDuration}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid2>
              <Grid2 size={{ md: 6, sm: 12 }}>
                <TextField
                  fullWidth
                  label="End Time"
                  type="datetime-local"
                  name="endDuration"
                  value={formData.endDuration}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                  required
                />
              </Grid2>
              <Grid2 size={{ md: 6, sm: 12 }}>
                <TextField
                  fullWidth
                  label="Location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={{ md: 6, sm: 12 }}>
                <TextField
                  fullWidth
                  label="Total Seats"
                  name="totalSeats"
                  type="number"
                  value={formData.totalSeats}
                  onChange={handleInputChange}
                />
              </Grid2>
              <Grid2 size={{ md: 6, sm: 12 }}>
                <FormControl fullWidth>
                  <InputLabel>Trainer</InputLabel>
                  <Select
                    name="trainerId"
                    value={formData.trainerId}
                    onChange={handleInputChange}
                    label="Trainer"
                  >
                    {trainers.map((trainer) => (
                      <MenuItem key={trainer.id} value={trainer.id}>
                        {trainer.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid2>
              <Grid2 size={{ md: 6, sm: 12 }}>
                <TextField
                  label="Registration Fee (INR)"
                  type="number"
                  name="registrationFee"
                  value={formData.registrationFee}
                  onChange={handleInputChange}
                  fullWidth
                />
              </Grid2>
              {isClass && (
                <Grid2 size={12}>
                  <FormControl fullWidth>
                    <InputLabel>Class Type</InputLabel>
                    <Select
                      name="classType"
                      value={formData.classType}
                      onChange={handleInputChange}
                      label="Class Type"
                    >
                      <MenuItem value="one-to-one">One-to-One</MenuItem>
                      <MenuItem value="group">Group</MenuItem>
                    </Select>
                  </FormControl>
                </Grid2>
              )}
            </Grid2>

            <Divider />

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Concept Note
              </Typography>
              <RichTextEditor
                value={conceptNoteEditor}
                onChange={setConceptNoteEditor}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" gutterBottom>
                Instructions
              </Typography>
              <RichTextEditor
                value={instructionsEditor}
                onChange={setInstructionsEditor}
              />
            </Box>

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

            {formData.recurrence && (
              <Box>
                <Button
                  variant="outlined"
                  onClick={() => setRecurrenceDialogOpen(true)}
                >
                  Set Recurrence Rule
                </Button>
                {formData.recurrenceRule && (
                  <Box mt={1} fontSize={12}>
                    <strong>Recurrence Rule:</strong>
                    <pre>{formData.recurrenceRule}</pre>
                  </Box>
                )}
                <RecurrencePopup
                  open={recurrenceDialogOpen}
                  onClose={() => setRecurrenceDialogOpen(false)}
                  onSave={(rule) =>
                    setFormData((prev) => ({
                      ...prev,
                      recurrenceRule: JSON.stringify(rule),
                    }))
                  }
                  initialValue={
                    formData.recurrenceRule
                      ? JSON.parse(formData.recurrenceRule)
                      : {}
                  }
                />
              </Box>
            )}

            <Divider />

            <Box>
              <Typography variant="subtitle1">Thumbnail</Typography>
              <input
                type="file"
                name="thumbnail"
                accept="image/*"
                onChange={handleFileChange}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1">
                Upload Multiple Images
              </Typography>
              <input
                type="file"
                name="images"
                accept="image/*"
                multiple
                onChange={handleFileChange}
              />
            </Box>

            <Divider />

            <Box>
              <Box
                display="flex"
                alignItems="center"
                justifyContent="space-between"
                mb={1}
              >
                <Typography variant="subtitle1">Add-On Items</Typography>
                <IconButton size="small" color="primary" onClick={addAddOnItem}>
                  <AddIcon />
                </IconButton>
              </Box>

              <Stack spacing={2}>
                {formData.addOnFees.map((item, index) => (
                  <Stack
                    key={index}
                    direction="row"
                    spacing={2}
                    alignItems="center"
                  >
                    <TextField
                      label="Name"
                      value={item.name}
                      onChange={(e) =>
                        handleAddOnChange(index, "name", e.target.value)
                      }
                    />
                    <TextField
                      label="Price (INR)"
                      type="number"
                      value={item.price}
                      onChange={(e) =>
                        handleAddOnChange(index, "price", e.target.value)
                      }
                    />
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => removeAddOnItem(index)}
                    >
                      Delete
                    </Button>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </form>
      </StyledDialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Box sx={{ flexGrow: 1 }}>
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
        </Box>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Creating..." : `Create ${isClass ? "Class" : "Event"}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateForm;
