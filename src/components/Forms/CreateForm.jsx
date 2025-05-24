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
import axiosInstance from "../../utils/axiosInstance";
import RecurrencePopup from "../ReccurencePopup/ReccurencePopup";
import RichTextEditor from "react-rte";
import AddIcon from "@mui/icons-material/Add";
import ImageUploader from "../ImageUploader/ImageUploader";

const CreateForm = ({ open, onSave, onClose, isClass = false }) => {
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

  const totalPayable =
    Number(formData.registrationFee || 0) +
    (Array.isArray(formData.addOnFees)
      ? formData.addOnFees.reduce((sum, item) => {
          const price = Number(item?.price);
          return sum + (isNaN(price) ? 0 : price);
        }, 0)
      : 0);

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
        if (key === "addOnFees") {
          formPayload.append("add_on_fees", JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
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
      onSave?.(res.data.class || res.data.event);
      onClose(); // ✅ Only close when it's truly successful
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Failed to create.");
    } finally {
      setLoading(false);
    }
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
          <CloseIcon color="error" />
        </IconButton>
      </DialogTitle>

      <>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3} p={4}>
            <Grid2 container spacing={2}>
              <Grid2 size={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid2>

              <Grid2 size={12} p={2}>
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
                <Grid2 size={12}>
                  {formData.recurrence && (
                    <Box>
                      <Button
                        variant="outlined"
                        onClick={() => setRecurrenceDialogOpen(true)}
                      >
                        Set Recurrence Rule
                      </Button>
                      {formData.recurrenceRule && (
                        <Box mt={2}>
                          <Typography variant="subtitle2">
                            Recurrence Schedule:
                          </Typography>
                          {(() => {
                            try {
                              const rule =
                                typeof formData.recurrenceRule === "string"
                                  ? JSON.parse(formData.recurrenceRule)
                                  : formData.recurrenceRule;

                              return Object.entries(rule).map(([day, time]) => (
                                <Typography
                                  key={day}
                                  variant="body2"
                                  sx={{ mt: 1 }}
                                >
                                  <strong>Every {day}</strong> — {time.start} to{" "}
                                  {time.end}
                                </Typography>
                              ));
                            } catch {
                              return (
                                <Typography variant="body2" color="error">
                                  ⚠️ Invalid recurrence format
                                </Typography>
                              );
                            }
                          })()}
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
                </Grid2>
              </Grid2>

              {!formData.recurrence && (
                <>
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
                </>
              )}
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
              <Grid2
                size={12}
                border={1}
                borderColor="#ccc"
                p={1}
                borderRadius={2}
              >
                <Box>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography variant="subtitle1">Add-On Items</Typography>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={addAddOnItem}
                    >
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
                  <Box
                    mt={3}
                    p={2}
                    bgcolor="#f5f5f5"
                    borderRadius={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    border="1px solid #ccc"
                  >
                    <Typography variant="subtitle1" fontWeight={600}>
                      Total Payable
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      ₹{totalPayable}
                    </Typography>
                  </Box>
                </Box>
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

            <Divider />

            {/* Thumbnail Upload */}
            <ImageUploader
              label="Upload Thumbnail"
              multiple={false}
              preview={thumbnail}
              onDrop={(acceptedFiles) => setThumbnail(acceptedFiles[0])}
            />

            {thumbnail && (
              <Box mt={2}>
                <Typography variant="subtitle2" gutterBottom>
                  Thumbnail Preview
                </Typography>
                <Box
                  sx={{
                    position: "relative",
                    width: 150,
                    height: 150,
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 1,
                  }}
                >
                  <img
                    src={URL.createObjectURL(thumbnail)}
                    alt="thumbnail-preview"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                  <Button
                    size="small"
                    color="error"
                    onClick={() => setThumbnail(null)}
                    sx={{
                      position: "absolute",
                      top: 4,
                      right: 4,
                      minWidth: "18px",
                      padding: 0,
                      lineHeight: 1,
                      fontSize: "0.75rem",
                    }}
                  >
                    ✕
                  </Button>
                </Box>
              </Box>
            )}

            {/* Multi-Image Upload */}
            <ImageUploader
              label="Upload Multiple Images"
              multiple={true}
              onDrop={(acceptedFiles) => setImages(acceptedFiles)}
            />

            {images.length > 0 && (
              <Box display="flex" gap={2} mt={2} flexWrap="wrap">
                {images.map((file, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      position: "relative",
                      width: 150,
                      height: 150,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 1,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`preview-${idx}`}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                    <Button
                      size="small"
                      color="error"
                      onClick={() => {
                        const updated = [...images];
                        updated.splice(idx, 1);
                        setImages(updated);
                      }}
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        minWidth: "24px",
                        padding: 0,
                        lineHeight: 1,
                        fontSize: "0.75rem",
                      }}
                    >
                      ✕
                    </Button>
                  </Box>
                ))}
              </Box>
            )}

            <Divider />
          </Stack>
        </form>
      </>

      <DialogActions sx={{ p: 2 }}>
        {error && (
          <Alert severity="error" sx={{ mr: "auto" }}>
            {error}
          </Alert>
        )}
        <Button onClick={onClose} variant="outlined" color="error">
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" disabled={loading}>
          {loading ? "Saving..." : "Create"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateForm;
