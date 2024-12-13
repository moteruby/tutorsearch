import React from 'react';
import { Box, Button } from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

const ImageUpload = ({ currentImage, onImageChange }) => {
  return (
    <Box sx={{ textAlign: 'center', mb: 3 }}>
      {currentImage && (
        <Box
          component="img"
          src={currentImage}
          alt="Profile"
          sx={{
            width: 200,
            height: 200,
            borderRadius: '50%',
            objectFit: 'cover',
            mb: 2
          }}
        />
      )}
      <Button
        component="label"
        variant="contained"
        startIcon={<CloudUploadIcon />}
      >
        Upload Photo
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={onImageChange}
        />
      </Button>
    </Box>
  );
};

export default ImageUpload; 