import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  Alert,
  useTheme,
} from "@mui/material";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";

const RegisterForm = ({
  open,
  onClose,
  title,
  formData,
  onFormChange,
  onSubmit,
  error,
  success,
}) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          bgcolor: theme.palette.beige,
          border: `2px solid ${theme.palette.brown}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.palette.orange,
          color: theme.palette.beige,
          borderBottom: `2px solid ${theme.palette.brown}`,
        }}
      >
        Register for {title}
      </DialogTitle>
      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert
            severity="error"
            sx={{
              mb: 2,
              bgcolor: theme.palette.beige,
              color: theme.palette.brown,
              border: `1px solid ${theme.palette.brown}`,
            }}
          >
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{
              mb: 2,
              bgcolor: theme.palette.beige,
              color: theme.palette.brown,
              border: `1px solid ${theme.palette.brown}`,
            }}
          >
            {success}
          </Alert>
        )}

        <Stack spacing={3} sx={{ mt: 1 }}>
          <TextField
            label="Full Name"
            fullWidth
            name="name"
            value={formData.name}
            onChange={onFormChange}
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.brown,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.orange,
                },
              },
            }}
          />
          <TextField
            label="Email"
            fullWidth
            name="email"
            type="email"
            value={formData.email}
            onChange={onFormChange}
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.brown,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.orange,
                },
              },
            }}
          />
          <TextField
            label="Phone Number"
            fullWidth
            name="phone"
            value={formData.phone}
            onChange={onFormChange}
            required
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.brown,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.orange,
                },
              },
            }}
          />
          <TextField
            label="Instagram Handle (optional)"
            fullWidth
            name="instaHandle"
            value={formData.instaHandle}
            onChange={onFormChange}
            variant="outlined"
            sx={{
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: theme.palette.brown,
                },
                "&:hover fieldset": {
                  borderColor: theme.palette.orange,
                },
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          borderTop: `2px solid ${theme.palette.brown}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: theme.palette.brown,
            "&:hover": {
              color: theme.palette.orange,
              bgcolor: "transparent",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          size="large"
          startIcon={<EventAvailableIcon />}
          sx={{
            px: 4,
            bgcolor: theme.palette.brown,
            color: theme.palette.beige,
            "&:hover": {
              bgcolor: theme.palette.orange,
            },
          }}
        >
          Submit Registration
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RegisterForm;
