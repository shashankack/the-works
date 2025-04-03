import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);
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
  ImageList,
  ImageListItem,
  Dialog,
  useTheme,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import CloseIcon from "@mui/icons-material/Close";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import InfoIcon from "@mui/icons-material/Info";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import GroupsIcon from "@mui/icons-material/Groups";

import RegisterForm from "../../components/Forms/RegisterForm";
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
dayjs.extend(localizedFormat);

import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

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
  const [selectedAddOns, setSelectedAddOns] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const thumbnailRef = useRef(null);

  const handleAddOnToggle = (index) => {
    setSelectedAddOns((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const getDurationHHMM = (start, end, recurrenceRule) => {
    if (recurrenceRule) {
      try {
        const rule =
          typeof recurrenceRule === "string"
            ? JSON.parse(recurrenceRule)
            : recurrenceRule;

        const [_, time] = Object.entries(rule)[0];
        const startTime = dayjs(`1970-01-01T${time.start}`);
        const endTime = dayjs(`1970-01-01T${time.end}`);
        const diffMs = endTime.diff(startTime);

        const d = dayjs.duration(diffMs);
        const hours = Math.floor(d.asHours());
        const minutes = d.minutes();
        return `${hours.toString().padStart(2, "0")}:${minutes
          .toString()
          .padStart(2, "0")}`;
      } catch {
        return null;
      }
    }

    if (!start || !end) return null;
    const diffMs = dayjs(end).diff(dayjs(start));
    const d = dayjs.duration(diffMs);
    const hours = Math.floor(d.asHours());
    const minutes = d.minutes();
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateTotal = () => {
    const base = Number(data.registrationFee || 0);
    const selectedFees = data.addOnFees
      .filter((_, i) => selectedAddOns.includes(i))
      .reduce((sum, item) => sum + Number(item.price || 0), 0);
    return base + selectedFees;
  };

  useEffect(() => {
    const handleFocus = () => fetchData();
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, []);

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

  useEffect(() => {
    if (thumbnailRef.current) {
      gsap.fromTo(
        thumbnailRef.current,
        { y: 0 },
        {
          y: 400,
          ease: "none",
          scrollTrigger: {
            trigger: thumbnailRef.current,
            start: "top top",
            end: "bottom top",
            scrub: true,
          },
        }
      );
    }
  });

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
        minHeight="100vh"
        backgroundColor={theme.colors.beige}
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
          ref={thumbnailRef}
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
                  xs: "1.75rem",
                  sm: "2.25rem",
                  md: "3rem",
                },
              }}
            >
              {data.title}
            </Typography>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={2}
              mt={2}
              flexWrap="wrap"
              useFlexGap
            >
              <Chip
                label={data.eventStatus || (isClass ? "Class" : "Event")}
                size="medium"
                sx={{
                  bgcolor: theme.colors.beige,
                  color: theme.colors.orange,
                  fontSize: "1rem",
                  fontWeight: 600,
                  px: 2,
                }}
              />

              {(data.startDuration && data.endDuration) ||
              data.recurrenceRule ? (
                <Chip
                  label={`${getDurationHHMM(
                    data.startDuration,
                    data.endDuration,
                    data.recurrenceRule
                  )} hrs`}
                  size="medium"
                  sx={{
                    bgcolor: theme.colors.beige,
                    color: theme.colors.orange,
                    fontSize: "1rem",
                    fontWeight: 600,
                    px: 2,
                  }}
                />
              ) : null}

              {data.registrationFee ? (
                <Chip
                  label={`₹${data.registrationFee}`}
                  size="medium"
                  sx={{
                    bgcolor: theme.colors.beige,
                    color: theme.colors.orange,
                    fontSize: "1rem",
                    fontWeight: 600,
                    px: 2,
                  }}
                />
              ) : null}
            </Stack>
          </Container>
        </Box>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid2 container spacing={4}>
          <Grid2 size={{ xs: 12, md: 8 }}>
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
                <Box
                  sx={{ color: theme.colors.beige, fontSize: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      data.conceptNote || "<p>No description available</p>",
                  }}
                />
              </CardContent>
            </Card>

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
                <Box
                  sx={{ color: theme.colors.beige, fontSize: "1rem" }}
                  dangerouslySetInnerHTML={{
                    __html:
                      data.instructions || "<p>No instructions available</p>",
                  }}
                />
              </CardContent>
            </Card>

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
                              {dayjs(data.startDuration).format(
                                "MMMM D, YYYY – h:mm A"
                              )}
                              {data.endDuration &&
                                ` - ${dayjs(data.endDuration).format(
                                  "MMMM D, YYYY – h:mm A"
                                )}`}
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
                  <Grid2 container spacing={3} alignItems="center">
                    <Grid2 item xs={12} sm={4}>
                      <Box
                        sx={{
                          width: 300,
                          height: 300,
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
                    </Grid2>
                    <Grid2 item xs={12} sm={8}>
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
                    </Grid2>
                  </Grid2>
                </CardContent>
              </Card>
            )}
          </Grid2>

          <Grid2 size={{ xs: 12, md: 4 }}>
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
                          Select Add-On Fees
                        </Typography>
                        <Stack spacing={0.5}>
                          {data.addOnFees.map((item, idx) => (
                            <FormControlLabel
                              key={idx}
                              control={
                                <Checkbox
                                  checked={selectedAddOns.includes(idx)}
                                  onChange={() => handleAddOnToggle(idx)}
                                  sx={{ color: theme.colors.brown }}
                                />
                              }
                              label={`${item.name} - ₹${item.price}`}
                            />
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
                      ₹{calculateTotal()}
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
          </Grid2>
        </Grid2>

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
              <ImageList variant="masonry" cols={3} gap={12}>
                {data.images.map((img, idx) => (
                  <ImageListItem
                    key={idx}
                    sx={{
                      cursor: "pointer",
                      overflow: "hidden",
                      transition: "transform 0.3s ease",
                      "&:hover": {
                        transform: "scale(0.90)",
                      },
                      "& img": {
                        transition: "transform 0.4s ease, filter 0.4s ease",
                        transform: "scale(1)",
                        filter: "brightness(1)",
                        "&:hover": {
                          transform: "scale(1.2)",
                          filter: "brightness(0.8)",
                        },
                      },
                    }}
                  >
                    <img
                      src={img}
                      alt={`Gallery ${idx + 1}`}
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                      onClick={() => setSelectedIndex(idx)}
                    />
                  </ImageListItem>
                ))}
              </ImageList>
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

      <Dialog
        open={selectedIndex !== null}
        onClose={() => setSelectedIndex(null)}
        fullScreen
        PaperProps={{ sx: { bgcolor: "transparent" } }}
      >
        {selectedIndex !== null && (
          <Box
            sx={{
              width: "100vw",
              height: "100vh",
              bgcolor: "rgba(0,0,0,0.85)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <IconButton
              onClick={() => setSelectedIndex(null)}
              sx={{
                position: "absolute",
                top: 20,
                right: 20,
                color: "white",
                zIndex: 20,
              }}
            >
              <CloseIcon
                sx={{
                  left: 20,
                  color: "red",
                  fontSize: 30,
                  zIndex: 20,
                  borderRadius: "50%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "scale(1.2)",
                  },
                }}
              />
            </IconButton>

            {/* Prev Button */}
            <IconButton
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev === 0 ? data.images.length - 1 : prev - 1
                )
              }
              sx={{
                position: "absolute",
                left: 20,
                color: "white",
                zIndex: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.4)" },
              }}
            >
              <ArrowBackIosNewIcon />
            </IconButton>

            {/* Next Button */}
            <IconButton
              onClick={() =>
                setSelectedIndex((prev) =>
                  prev === data.images.length - 1 ? 0 : prev + 1
                )
              }
              sx={{
                position: "absolute",
                right: 20,
                color: "white",
                zIndex: 20,
                backgroundColor: "rgba(255,255,255,0.2)",
                "&:hover": { backgroundColor: "rgba(255,255,255,0.4)" },
              }}
            >
              <ArrowForwardIosIcon />
            </IconButton>

            {/* Full Image */}
            <img
              src={data.images[selectedIndex]}
              alt={`Preview ${selectedIndex}`}
              style={{
                maxWidth: "90vw",
                maxHeight: "90vh",
                objectFit: "contain",
                borderRadius: 8,
              }}
            />
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default Details;
