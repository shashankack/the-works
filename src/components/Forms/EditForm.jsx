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
import AddIcon from "@mui/icons-material/Add";
import SubtractIcon from "@mui/icons-material/Remove";
import { styled } from "@mui/system";
import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import RecurrencePopup from "../ReccurencePopup/ReccurencePopup";
import RichTextEditor from "react-rte";
import ImageUploader from "../ImageUploader/ImageUploader";

const StyledDialogContent = styled(DialogContent)({
  height: "680px",
  overflowY: "auto",
});

const EditForm = ({ open, onClose, initialData, isClass = false, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDuration: "",
    endDuration: "",
    eventStatus: "UPCOMING",
    location: "",
    classType: isClass ? "one-to-one" : "",
    recurrence: false,
    recurrenceRule: "",
    trainerId: "",
    statusToggle: "active",
    totalSeats: initialData.totalSeats ?? initialData.availableSeats ?? 0,
    registrationFee: 0,
    addOnFees: [],
  });

  const totalPayable =
    formData.registrationFee +
    formData.addOnFees.reduce(
      (sum, item) => sum + (Number(item.price) || 0),
      0
    );

  const [conceptNoteEditor, setConceptNoteEditor] = useState(
    RichTextEditor.createEmptyValue()
  );
  const [instructionsEditor, setInstructionsEditor] = useState(
    RichTextEditor.createEmptyValue()
  );
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [recurrenceDialogOpen, setRecurrenceDialogOpen] = useState(false);
  const [trainers, setTrainers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || "",
        startDuration: initialData.startDuration || "",
        endDuration: initialData.endDuration || "",
        eventStatus: initialData.eventStatus || "UPCOMING",
        location: initialData.location || "",
        classType: initialData.classType || (isClass ? "one-to-one" : ""),
        recurrence: Boolean(
          initialData.recurrence || initialData.recurrenceRule
        ),
        statusToggle:
          initialData.eventStatus === "CANCELLED" ? "cancelled" : "active",
        recurrenceRule: initialData.recurrenceRule || "",
        trainerId: initialData.trainer?.id || "",
        totalSeats: initialData.totalSeats ?? 0,
        registrationFee: initialData.registrationFee ?? 0,
        addOnFees: (() => {
          if (Array.isArray(initialData.addOnFees))
            return initialData.addOnFees;
          try {
            const parsed = JSON.parse(initialData.addOnFees || "[]");
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })(),
      });

      setConceptNoteEditor(
        RichTextEditor.createValueFromString(
          initialData.conceptNote || "",
          "html"
        )
      );
      setInstructionsEditor(
        RichTextEditor.createValueFromString(
          initialData.instructions || "",
          "html"
        )
      );

      if (initialData.thumbnail) setThumbnailPreview(initialData.thumbnail);

      const parsedImages =
        typeof initialData.imageUrls === "string"
          ? JSON.parse(initialData.imageUrls || "[]")
          : Array.isArray(initialData.imageUrls)
          ? initialData.imageUrls
          : [];

      setImagePreviews(parsedImages);
      setImages([]);
    }
  }, [initialData, isClass]);

  useEffect(() => {
    axiosInstance
      .get("/admin/trainers")
      .then((res) => setTrainers(res.data.trainers || []));
  }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddOnChange = (index, field, value) => {
    const updated = [...formData.addOnFees];
    updated[index][field] = field === "price" ? Number(value) : value;
    setFormData({ ...formData, addOnFees: updated });
  };

  const handleDeleteImage = async (url) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );
    if (!confirmed) return;

    try {
      const endpoint = `/admin/${isClass ? "classes" : "events"}/${
        initialData.id
      }/delete-image`;
      await axiosInstance.delete(endpoint, { data: { imageUrl: url } });
      setImagePreviews((prev) => prev.filter((img) => img !== url));
    } catch (err) {
      alert("Failed to delete image.");
    }
  };

  const handleDeleteThumbnail = async () => {
    if (!window.confirm("Delete current thumbnail?")) return;

    try {
      const endpoint = `/admin/${isClass ? "classes" : "events"}/${
        initialData.id
      }/delete-thumbnail`;
      await axiosInstance.delete(endpoint);
      setThumbnailPreview("");
    } catch (err) {
      alert("Failed to delete thumbnail.");
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = `/admin/${isClass ? "classes" : "events"}/${
        initialData.id
      }`;
      const formPayload = new FormData();

      const submission = {
        ...formData,
        conceptNote: conceptNoteEditor.toString("html"),
        instructions: instructionsEditor.toString("html"),
      };

      Object.entries(submission).forEach(([key, value]) => {
        if (key === "addOnFees") {
          formPayload.append("add_on_fees", JSON.stringify(value));
        } else if (key === "recurrenceRule") {
          try {
            const validJson =
              typeof value === "string" ? value : JSON.stringify(value);
            formPayload.append("recurrenceRule", validJson);
          } catch {
            console.error("Invalid recurrenceRule, skipping");
          }
        } else if (value !== undefined && value !== null) {
          formPayload.append(
            key,
            typeof value === "boolean" ? value.toString() : value
          );
        }
      });

      if (thumbnail) formPayload.append("thumbnail", thumbnail);
      images.forEach((img) => formPayload.append("images", img));

      const response = await axiosInstance.put(endpoint, formPayload, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (!response.data.success) throw new Error("Update failed");
      onSave(response.data.class || response.data.event);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update.");
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
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Edit {isClass ? "Class" : "Event"}
        <IconButton onClick={onClose}>
          <CloseIcon color="error" />
        </IconButton>
      </DialogTitle>

      <StyledDialogContent>
        <Stack spacing={3} p={4}>
          <Grid2 container spacing={2}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Grid2>

            {!formData.recurrence && (
              <>
                <Grid2 size={{ xs: 12, md: 6 }}>
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

                <Grid2 size={{ xs: 12, md: 6 }}>
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

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Total Seats"
                name="totalSeats"
                type="number"
                value={formData.totalSeats}
                onChange={handleInputChange}
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <TextField
                label="Registration Fee (INR)"
                type="number"
                name="registrationFee"
                value={formData.registrationFee}
                onChange={handleInputChange}
                fullWidth
              />
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
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
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="statusToggle"
                  value={formData.statusToggle}
                  onChange={handleInputChange}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
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
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1">Add-On Fees</Typography>
                  <IconButton
                    color="primary"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        addOnFees: [...prev.addOnFees, { name: "", price: 0 }],
                      }))
                    }
                  >
                    <AddIcon />
                  </IconButton>
                </Box>

                <Stack spacing={2}>
                  {formData.addOnFees.map((item, idx) => (
                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      key={idx}
                    >
                      <TextField
                        label="Name"
                        value={item.name}
                        onChange={(e) =>
                          handleAddOnChange(idx, "name", e.target.value)
                        }
                      />
                      <TextField
                        label="Price (INR)"
                        type="number"
                        value={item.price}
                        onChange={(e) =>
                          handleAddOnChange(idx, "price", e.target.value)
                        }
                      />
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            addOnFees: prev.addOnFees.filter(
                              (_, i) => i !== idx
                            ),
                          }))
                        }
                      >
                        <SubtractIcon />
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
                  >
                    <MenuItem value="one-to-one">One-to-One</MenuItem>
                    <MenuItem value="group">Group</MenuItem>
                  </Select>
                </FormControl>
              </Grid2>
            )}
          </Grid2>

          <Grid2 size={12} p={2}>
            <FormControlLabel
              control={
                <Checkbox
                  fullWidth
                  checked={formData.recurrence}
                  onChange={handleInputChange}
                  name="recurrence"
                />
              }
              label="Is this recurring?"
            />

            {formData.recurrence && (
              <Grid2 size={{ xs: 12, md: 6 }}>
                <Button
                  variant="outlined"
                  onClick={() => setRecurrenceDialogOpen(true)}
                >
                  Set Recurrence Rule
                </Button>
                {formData.recurrenceRule && (
                  <Box mt={2} p={2}>
                    <Typography variant="subtitle2">
                      Recurrence Schedule:
                    </Typography>
                    {(() => {
                      try {
                        const rule = JSON.parse(formData.recurrenceRule);
                        const day = Object.keys(rule)[0];
                        const time = rule[day];
                        return (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            <strong>Every {day}</strong> — {time.start} to{" "}
                            {time.end}
                          </Typography>
                        );
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
              </Grid2>
            )}
          </Grid2>

          <Divider />

          <Box>
            <Typography variant="subtitle1">Concept Note</Typography>
            <RichTextEditor
              value={conceptNoteEditor}
              onChange={setConceptNoteEditor}
            />
          </Box>

          <Box>
            <Typography variant="subtitle1">Instructions</Typography>
            <RichTextEditor
              value={instructionsEditor}
              onChange={setInstructionsEditor}
            />
          </Box>

          <Divider />

          <ImageUploader
            label="Upload Thumbnail"
            multiple={false}
            preview={thumbnail}
            onDrop={(accepted) => setThumbnail(accepted[0])}
          />

          {thumbnailPreview && (
            <Box mt={2}>
              <Typography variant="subtitle2">Current Thumbnail</Typography>
              <Box display="flex" gap={2} alignItems="center">
                <img
                  src={thumbnailPreview}
                  alt="thumbnail"
                  width={150}
                  height={150}
                  style={{ objectFit: "cover" }}
                />
                <Button
                  onClick={handleDeleteThumbnail}
                  color="error"
                  variant="outlined"
                >
                  Delete
                </Button>
              </Box>
            </Box>
          )}

          <ImageUploader
            label="Upload Multiple Images"
            multiple
            onDrop={setImages}
          />

          {imagePreviews.length > 0 && (
            <Box display="flex" flexWrap="wrap" gap={2}>
              {imagePreviews.map((img, i) => (
                <Box key={i} sx={{ position: "relative" }}>
                  <img
                    src={img}
                    alt={`preview-${i}`}
                    width={100}
                    height={100}
                    style={{ objectFit: "cover" }}
                  />
                  <Button
                    onClick={() => handleDeleteImage(img)}
                    size="small"
                    color="error"
                    sx={{ mt: 1 }}
                    variant="outlined"
                  >
                    Delete
                  </Button>
                </Box>
              ))}
            </Box>
          )}

          <Divider />
        </Stack>
      </StyledDialogContent>

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
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </DialogActions>

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
          formData.recurrenceRule ? JSON.parse(formData.recurrenceRule) : {}
        }
      />
    </Dialog>
  );
};

export default EditForm;
