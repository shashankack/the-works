import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
  Grid2,
} from "@mui/material";
import { useState } from "react";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const RecurrencePopup = ({ open, onClose, onSave, initialValue = {} }) => {
  const [selectedDays, setSelectedDays] = useState(
    Object.keys(initialValue).length ? initialValue : {}
  );

  const handleDayToggle = (day) => {
    setSelectedDays((prev) => {
      const updated = { ...prev };
      if (updated[day]) {
        delete updated[day];
      } else {
        updated[day] = { start: "", end: "" };
      }
      return updated;
    });
  };

  const handleTimeChange = (day, field, value) => {
    setSelectedDays((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  };

  const handleSave = () => {
    onSave(selectedDays);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Set Recurrence Schedule</DialogTitle>
      <DialogContent>
        <Grid2 container spacing={2}>
          {daysOfWeek.map((day) => (
            <Grid2 item xs={12} key={day}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!selectedDays[day]}
                    onChange={() => handleDayToggle(day)}
                  />
                }
                label={day}
              />
              {selectedDays[day] && (
                <Grid2 container spacing={1} sx={{ mt: 1 }}>
                  <Grid2 item xs={6}>
                    <TextField
                      label="Start Time"
                      type="time"
                      fullWidth
                      value={selectedDays[day].start}
                      onChange={(e) =>
                        handleTimeChange(day, "start", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid2>
                  <Grid2 item xs={6}>
                    <TextField
                      label="End Time"
                      type="time"
                      fullWidth
                      value={selectedDays[day].end}
                      onChange={(e) =>
                        handleTimeChange(day, "end", e.target.value)
                      }
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid2>
                </Grid2>
              )}
            </Grid2>
          ))}
        </Grid2>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecurrencePopup;
