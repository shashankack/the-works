import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Chip,
  Divider,
  Stack,
  IconButton,
  Grid,
  Grid2,
  Card,
  CardContent,
  Container,
} from "@mui/material";
import { useTheme } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PaymentIcon from "@mui/icons-material/Payment";
import GroupsIcon from "@mui/icons-material/Groups";

import RegisterForm from "../../components/Forms/RegisterForm";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const Details = ({ isClass }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

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
          } catch {
            images = [];
          }
        }

        let addOnFees = [];
        if (fetchedItem.addOnFees) {
          try {
            addOnFees = Array.isArray(fetchedItem.addOnFees)
              ? fetchedItem.addOnFees
              : JSON.parse(fetchedItem.addOnFees);
          } catch {
            addOnFees = [];
          }
        }

        setData({ ...fetchedItem, images, addOnFees });
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
        .map(([day, time]) => `${day}: ${time.start} - ${time.end}`)
        .join("\n");
    } catch (error) {
      return "Schedule not available";
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
        minHeight="80vh"
      >
        <CircularProgress sx={{ color: theme.colors.orange }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
        <Button
          onClick={() => navigate(-1)}
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{
            bgcolor: theme.colors.orange,
            color: theme.colors.beige,
            "&:hover": {
              bgcolor: theme.colors.brown,
            },
          }}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  if (!data) return null;

  return (
    <Box sx={{ bgcolor: theme.colors.beige, minHeight: "100vh" }}>
      {/* Hero Section */}
      <Box
        sx={{
          position: "relative",
          height: { xs: "50vh", md: "60vh" },
          overflow: "hidden",
          mb: 4,
        }}
      >
        <Box
          component="img"
          src={data.thumbnail}
          alt={data.title}
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.7)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            p: { xs: 3, md: 6 },
            background:
              "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 100%)",
          }}
        >
          <Container maxWidth="lg">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => navigate(-1)}
              sx={{
                color: theme.colors.beige,
                mb: 2,
                "&:hover": {
                  color: theme.colors.orange,
                },
              }}
            >
              Back
            </Button>
            <Typography
              variant="h2"
              component="h1"
              sx={{
                color: theme.colors.beige,
                fontWeight: 700,
                mb: 1,
                fontSize: {
                  xs: "1.75rem", // small screen (≈h4)
                  sm: "2.25rem", // medium (≈h3)
                  md: "3rem", // default (≈h2)
                },
              }}
            >
              {data.title}
            </Typography>
            <Stack direction="row" spacing={2} mt={2}>
              <Chip
                label={data.eventStatus || (isClass ? "Class" : "Event")}
                size="medium"
                sx={{
                  bgcolor: theme.colors.orange,
                  color: theme.colors.beige,
                  fontSize: "1rem",
                  fontWeight: 600,
                  px: 2,
                }}
              />
              {data.registrationFee && (
                <Chip
                  label={`₹${data.registrationFee}`}
                  size="medium"
                  sx={{
                    bgcolor: theme.colors.beige,
                    color: theme.colors.brown,
                    fontSize: "1rem",
                    fontWeight: 600,
                    px: 2,
                  }}
                />
              )}
            </Stack>
          </Container>
        </Box>
      </Box>

      {/* Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left Column - Details */}
          <Grid item xs={12} md={8}>
            {/* About Section */}
            <Card
              sx={{
                mb: 4,
                bgcolor: theme.colors.orange,
                color: theme.colors.beige,
                borderRadius: 4,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, color: theme.colors.beige }}
                >
                  About This {isClass ? "Class" : "Event"}
                </Typography>
                <Divider
                  sx={{
                    mb: 3,
                    borderColor: theme.colors.brown,
                  }}
                />
                <Typography>
                  {data.conceptNote || "No description available"}
                </Typography>
              </CardContent>
            </Card>

            {/* Instructions Card */}

            <Card
              sx={{
                mb: 4,
                bgcolor: theme.colors.orange,
                color: theme.colors.beige,
                borderRadius: 4,
              }}
            >
              <CardContent>
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  Important Instructions
                </Typography>
                <Divider
                  sx={{
                    mb: 3,
                    borderColor: theme.colors.brown,
                  }}
                />
                <Typography>
                  {data.instructions || "No instructions available"}
                </Typography>
              </CardContent>
            </Card>

            {/* Schedule Section */}
            <Card
              sx={{
                mb: 4,
                bgcolor: theme.colors.beige,
                border: `1px solid ${theme.colors.brown}`,
                borderRadius: 3,
                boxShadow: 1,
              }}
            >
              <CardContent>
                <Typography
                  variant="h5"
                  gutterBottom
                  sx={{ fontWeight: 600, color: theme.colors.brown }}
                >
                  Schedule & Location
                </Typography>

                <Divider sx={{ mb: 3, borderColor: theme.colors.brown }} />

                <Grid2 container spacing={3}>
                  <Grid2 xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: theme.colors.orange,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      {data.recurrenceRule ? (
                        <>
                          <AccessTimeIcon
                            sx={{ color: theme.colors.beige, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: theme.colors.beige }}
                            >
                              Class Schedule
                            </Typography>
                            <Typography
                              component="div"
                              sx={{
                                whiteSpace: "pre-line",
                                color: theme.colors.beige,
                                fontSize: "0.9rem",
                              }}
                            >
                              {formatRecurrenceRule(data.recurrenceRule)}
                            </Typography>
                          </Box>
                        </>
                      ) : (
                        <>
                          <CalendarTodayIcon
                            sx={{ color: theme.colors.beige, mt: 0.5 }}
                          />
                          <Box>
                            <Typography
                              variant="subtitle2"
                              sx={{ color: theme.colors.beige }}
                            >
                              Date
                            </Typography>
                            <Typography sx={{ color: theme.colors.beige }}>
                              {data.startDuration}
                              {data.endDuration && ` - ${data.endDuration}`}
                            </Typography>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Grid2>

                  <Grid2 xs={12} md={6}>
                    <Box
                      sx={{
                        p: 2,
                        bgcolor: theme.colors.brown,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 2,
                      }}
                    >
                      <LocationOnIcon
                        sx={{ color: theme.colors.beige, mt: 0.5 }}
                      />
                      <Box>
                        <Typography
                          variant="subtitle2"
                          sx={{ color: theme.colors.beige }}
                        >
                          Location
                        </Typography>
                        <Typography sx={{ color: theme.colors.beige }}>
                          {data.location}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid2>
                </Grid2>
              </CardContent>
            </Card>

            {/* Trainer Section */}
            {data.trainer && (
              <Card
                sx={{
                  mb: 4,
                  bgcolor: theme.colors.beige,
                  border: `1px solid ${theme.colors.brown}`,
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{ fontWeight: 600, color: theme.colors.brown }}
                  >
                    About The Trainer
                  </Typography>
                  <Divider
                    sx={{
                      mb: 3,
                      borderColor: theme.colors.brown,
                    }}
                  />
                  <Grid container spacing={3} alignItems="center">
                    <Grid item xs={12} sm={4}>
                      <Box
                        sx={{
                          width: "100%",
                          height: 200,
                          borderRadius: 2,
                          overflow: "hidden",
                          border: `1px solid ${theme.colors.brown}`,
                        }}
                      >
                        <img
                          src={data.trainer.image || "/placeholder-trainer.jpg"}
                          alt={data.trainer.name}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <Stack spacing={1}>
                        <Typography
                          variant="h6"
                          sx={{ color: theme.colors.brown }}
                        >
                          {data.trainer.name}
                        </Typography>
                        <Chip
                          label={data.trainer.specialization}
                          size="small"
                          sx={{
                            bgcolor: theme.colors.orange,
                            color: theme.colors.beige,
                            alignSelf: "flex-start",
                          }}
                        />
                        {data.trainer.bio && (
                          <Typography
                            variant="body2"
                            sx={{ color: theme.colors.brown }}
                          >
                            {data.trainer.bio}
                          </Typography>
                        )}
                      </Stack>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>

          {/* Right Column - Sidebar */}
          <Grid item xs={12} md={4}>
            {/* Quick Info Card */}
            <Card
              sx={{
                mb: 4,
                boxShadow: 4,
                borderRadius: 4,
                position: "sticky",
                top: 20,
                bgcolor: theme.colors.orange,
                color: theme.colors.beige,
              }}
            >
              <CardContent>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontWeight: 600, color: theme.colors.beige }}
                >
                  Quick Info
                </Typography>
                <Divider
                  sx={{
                    mb: 3,
                    borderColor: theme.colors.beige,
                  }}
                />
                <Stack spacing={2}>
                  <Box
                    p={1.5}
                    bgcolor={theme.colors.beige}
                    borderRadius={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography fontWeight={600} color={theme.colors.orange}>
                      Registration Fee
                    </Typography>
                    <Typography fontWeight={700} color={theme.colors.brown}>
                      ₹{data.registrationFee}
                    </Typography>
                  </Box>

                  {Array.isArray(data.addOnFees) &&
                    data.addOnFees.length > 0 && (
                      <Box
                        p={1.5}
                        bgcolor={theme.colors.beige}
                        borderRadius={2}
                        mb={1}
                      >
                        <Typography
                          fontWeight={600}
                          color={theme.colors.orange}
                          mb={1}
                        >
                          Add-On Fees
                        </Typography>
                        <Stack spacing={0.5}>
                          {data.addOnFees.map((item, idx) => (
                            <Box
                              key={idx}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography color={theme.colors.brown}>
                                {item.name}
                              </Typography>
                              <Typography
                                fontWeight={600}
                                color={theme.colors.brown}
                              >
                                ₹{item.price}
                              </Typography>
                            </Box>
                          ))}
                        </Stack>
                      </Box>
                    )}

                  <Box
                    mt={1}
                    p={2}
                    bgcolor={theme.colors.beige}
                    borderRadius={2}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontWeight={600} color={theme.colors.orange}>
                      Total Payable
                    </Typography>
                    <Typography fontWeight={700} color={theme.colors.brown}>
                      ₹
                      {data.registrationFee +
                        data.addOnFees.reduce(
                          (sum, f) => sum + Number(f.price || 0),
                          0
                        )}
                    </Typography>
                  </Box>

                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        color: theme.colors.beige,
                      }}
                    >
                      <GroupsIcon fontSize="small" />
                      Capacity
                    </Typography>
                    <Typography sx={{ color: theme.colors.beige }}>
                      {data.totalSeats} participants
                    </Typography>
                  </Box>

                  {typeof data.availableSeats === "number" && (
                    <Box>
                      <Typography
                        variant="subtitle2"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 1,
                          color: theme.colors.beige,
                        }}
                      >
                        <InfoIcon fontSize="small" />
                        Available Seats
                      </Typography>
                      <Chip
                        label={`${data.availableSeats} seats left`}
                        size="medium"
                        sx={{
                          bgcolor:
                            data.availableSeats > 5
                              ? theme.colors.beige
                              : theme.colors.red || "#d32f2f",
                          color:
                            data.availableSeats > 5
                              ? theme.colors.brown
                              : theme.colors.beige,
                          fontWeight: "bold",
                          fontSize: "1rem",
                          px: 2,
                          py: 1,
                        }}
                      />
                    </Box>
                  )}
                </Stack>

                {data.eventStatus === "UPCOMING" && (
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<EventAvailableIcon />}
                    onClick={() => setShowForm(true)}
                    disabled={data.availableSeats === 0}
                    sx={{
                      mt: 3,
                      bgcolor:
                        data.availableSeats === 0
                          ? theme.colors.brown
                          : theme.colors.brown,
                      color: theme.colors.beige,
                      "&:hover": {
                        bgcolor:
                          data.availableSeats === 0
                            ? theme.colors.brown
                            : theme.colors.beige,
                        color:
                          data.availableSeats === 0
                            ? theme.colors.beige
                            : theme.colors.brown,
                      },
                    }}
                  >
                    {data.availableSeats === 0
                      ? "Fully Booked"
                      : "Register Now"}
                  </Button>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        {/* Gallery Section */}
        {data.images?.length > 0 && (
          <Card
            sx={{
              bgcolor: theme.colors.beige,
              border: `1px solid ${theme.colors.brown}`,
            }}
          >
            <CardContent>
              <Typography
                variant="h5"
                gutterBottom
                sx={{ fontWeight: 600, color: theme.colors.brown }}
              >
                Gallery
              </Typography>
              <Divider
                sx={{
                  mb: 3,
                  borderColor: theme.colors.brown,
                }}
              />
              <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                  },
                  768: {
                    slidesPerView: 2,
                  },
                  1024: {
                    slidesPerView: 3,
                  },
                }}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                style={{
                  borderRadius: 8,
                  "--swiper-pagination-color": theme.colors.orange,
                  "--swiper-navigation-color": theme.colors.orange,
                }}
              >
                {data.images.map((img, index) => (
                  <SwiperSlide key={index}>
                    <Box
                      sx={{
                        height: { xs: 300, md: 400 },
                        borderRadius: 1,
                        overflow: "hidden",
                        border: `1px solid ${theme.colors.brown}`,
                      }}
                    >
                      <img
                        src={img}
                        alt={`Gallery ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    </Box>
                  </SwiperSlide>
                ))}
              </Swiper>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Registration Form Modal */}
      <RegisterForm
        open={showForm}
        onClose={() => setShowForm(false)}
        title={data?.title}
        formData={formData}
        onFormChange={handleChange}
        onSubmit={handleSubmit}
        error={formError}
        success={formSuccess}
      />
    </Box>
  );
};

export default Details;
