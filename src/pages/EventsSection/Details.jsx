import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

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

  if (loading) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress />
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
      <Button variant="outlined" onClick={() => navigate(-1)}>
        ⬅ Back
      </Button>

      {data && (
        <Card sx={{ mt: 3 }}>
          {data.thumbnail && (
            <CardMedia
              component="img"
              height="300"
              image={data.thumbnail}
              alt="Thumbnail"
            />
          )}
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {data.title}
            </Typography>

            <Typography>
              <strong>Status:</strong> {data.eventStatus}
            </Typography>
            <Typography>
              <strong>Location:</strong> {data.location}
            </Typography>
            <Typography>
              <strong>Start:</strong> {data.startDuration}
            </Typography>
            <Typography>
              <strong>End:</strong> {data.endDuration}
            </Typography>
            <Typography>
              <strong>Recurrence:</strong>{" "}
              {data.recurrence ? (
                <pre>
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
            </Typography>
            <Typography sx={{ mt: 2 }}>
              <strong>Description:</strong>{" "}
              {data.conceptNote || "No description available"}
            </Typography>

            {data.trainer && (
              <Box mt={3}>
                <Typography variant="h6">Trainer</Typography>
                <Typography>
                  <strong>Name:</strong> {data.trainer.name}
                </Typography>
                <Typography>
                  <strong>Phone:</strong> {data.trainer.phone || "Not provided"}
                </Typography>
                <Typography>
                  <strong>Specialization:</strong>{" "}
                  {data.trainer.specialization || "Not provided"}
                </Typography>
              </Box>
            )}

            {data.images?.length > 0 && (
              <Box mt={4}>
                <Typography variant="h6">Gallery</Typography>
                <Grid container spacing={2} mt={1}>
                  {data.images.map((img, index) => (
                    <Grid item xs={6} md={4} key={index}>
                      <Card>
                        <CardMedia
                          component="img"
                          image={img}
                          alt={`img-${index}`}
                        />
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            )}

            <Box mt={4}>
              <Button variant="contained" onClick={() => setShowForm(true)}>
                Register
              </Button>
            </Box>
          </CardContent>
        </Card>
      )}

      <Dialog open={showForm} onClose={() => setShowForm(false)}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          {formError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {formError}
            </Alert>
          )}
          {formSuccess && (
            <Alert severity="success" sx={{ mb: 2 }}>
              {formSuccess}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
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
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowForm(false)}>Cancel</Button>
          <Button type="submit" onClick={handleSubmit} variant="contained">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Details;
