import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Box,
  Grid2,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

import ImageSlider from "../../components/GridGallery/ImageSlider";

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

  const formatRecurrenceRule = (data) => {
    try {
      const rule = JSON.parse(data);
      const entries = Object.entries(rule);

      return entries
        .map(([day, time]) => `${day} - ${time.start} - ${time.end}`)
        .join(", ");
    } catch (error) {
      return "Invalid recurrence rule!";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setFormSuccess("");

    if (!formData.name || !formData.email || !formData.phone) {
      setFormError("Name, Email and Phone are required.");
      return;
    }

    try {
      await axiosInstance.post(
        `/${isClass ? "classes" : "events"}/${id}/register`,
        formData
      );
      setFormSuccess("Registration successful!");
      setFormData({ name: "", email: "", phone: "", instaHandle: "" });
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

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box textAlign="center" mt={5}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {data && (
        <Grid2 border={1} p={5} container spacing={2}>
          <Grid2 size={9} border={1}>
            <Typography variant="h4">{data.title}</Typography>
          </Grid2>
          <Grid2 size={3} border={1}>
            <Typography>
              <strong>Status:</strong> {data.eventStatus}
            </Typography>
          </Grid2>
          <Grid2 size={4} border={1}>
            {data.thumbnail && (
              <img
                src={data.thumbnail}
                alt={data.title}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </Grid2>
          <Grid2 size={8} border={1}>
            <Typography>
              <strong>Location:</strong> {data.location}
            </Typography>
            {data.startDuration && (
              <Typography>
                <strong>Start:</strong> {data.startDuration || "TBA"}
              </Typography>
            )}
            {data.endDuration && (
              <Typography>
                <strong>End:</strong> {data.endDuration || "TBA"}
              </Typography>
            )}
            <Typography>
              <strong>Registration Fee:</strong> ₹
              {data.registrationFee || "No registration fee"}
            </Typography>
            {data.recurrenceRule && (
              <Typography>
                <strong>Duration:</strong>{" "}
                {formatRecurrenceRule(data.recurrenceRule)}
              </Typography>
            )}
            <Typography>
              <strong>Description:</strong>{" "}
              {data.description || "No description available"}
            </Typography>
            <Typography>
              <strong>Instructions:</strong>{" "}
              {data.instructions || "No instructions available"}
            </Typography>
          </Grid2>

          {data.trainer && (
            <Grid2 xs={12}>
              <Typography variant="h6">Trainer</Typography>
              <Typography>
                <strong>Name:</strong> {data.trainer.name}
              </Typography>
              <Typography>
                <strong>Specialization:</strong> {data.trainer.specialization}
              </Typography>
            </Grid2>
          )}

          {data.images?.length > 0 && (
            <Grid2 size={12} border={1} height={600}>
              <Typography variant="h6">Gallery</Typography>
              <Grid2 height={"100%"} border={"1px solid red"} spacing={2}>
                <ImageSlider images={data.images} direction="horizontal" />
              </Grid2>
            </Grid2>
          )}

          {data.eventStatus === "UPCOMING" && (
            <Grid2 xs={12}>
              <Button variant="contained" onClick={() => setShowForm(true)}>
                Register
              </Button>
            </Grid2>
          )}
        </Grid2>
      )}

      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          {formError && <Alert severity="error">{formError}</Alert>}
          {formSuccess && <Alert severity="success">{formSuccess}</Alert>}
          <TextField
            margin="dense"
            label="Name"
            fullWidth
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Phone"
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <TextField
            margin="dense"
            label="Instagram Handle (optional)"
            fullWidth
            name="instaHandle"
            value={formData.instaHandle}
            onChange={handleChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Details;
