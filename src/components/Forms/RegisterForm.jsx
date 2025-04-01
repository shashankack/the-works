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
          bgcolor: theme.colors.beige,
          border: `2px solid ${theme.colors.brown}`,
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: theme.colors.orange,
          color: theme.colors.beige,
          borderBottom: `2px solid ${theme.colors.brown}`,
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
              bgcolor: theme.colors.beige,
              color: theme.colors.brown,
              border: `1px solid ${theme.colors.brown}`,
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
              bgcolor: theme.colors.beige,
              color: theme.colors.brown,
              border: `1px solid ${theme.colors.brown}`,
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
                  borderColor: theme.colors.brown,
                },
                "&:hover fieldset": {
                  borderColor: theme.colors.orange,
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
                  borderColor: theme.colors.brown,
                },
                "&:hover fieldset": {
                  borderColor: theme.colors.orange,
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
                  borderColor: theme.colors.brown,
                },
                "&:hover fieldset": {
                  borderColor: theme.colors.orange,
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
                  borderColor: theme.colors.brown,
                },
                "&:hover fieldset": {
                  borderColor: theme.colors.orange,
                },
              },
            }}
          />
        </Stack>
      </DialogContent>
      <DialogActions
        sx={{
          p: 3,
          borderTop: `2px solid ${theme.colors.brown}`,
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            color: theme.colors.brown,
            "&:hover": {
              color: theme.colors.orange,
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
            bgcolor: theme.colors.brown,
            color: theme.colors.beige,
            "&:hover": {
              bgcolor: theme.colors.orange,
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
