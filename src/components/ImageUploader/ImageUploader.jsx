import { useDropzone } from "react-dropzone";
import { Box, Typography } from "@mui/material";

const ImageUploader = ({
  onDrop,
  multiple = false,
  label = "Upload Image",
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple,
    accept: {
      "image/*": [],
    },
  });

  return (
    <Box
      {...getRootProps()}
      sx={{
        border: "2px dashed #ccc",
        borderRadius: 2,
        p: 3,
        textAlign: "center",
        backgroundColor: isDragActive ? "#f0f0f0" : "#fafafa",
        cursor: "pointer",
      }}
    >
      <input {...getInputProps()} />
      <Typography variant="subtitle1">{label}</Typography>
      <Typography variant="body2" color="text.secondary">
        {multiple
          ? "Drag and drop or click to upload multiple images"
          : "Drag and drop or click to upload an image"}
      </Typography>
    </Box>
  );
};

export default ImageUploader;
