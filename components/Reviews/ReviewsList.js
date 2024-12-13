import React from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  Paper 
} from '@mui/material';

const ReviewsList = ({ reviews }) => {
  return (
    <Box>
      {reviews.map((review, index) => (
        <Paper 
          key={review.id} 
          elevation={1} 
          sx={{ mb: 2, p: 2 }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {review.studentName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(review.date).toLocaleDateString()}
            </Typography>
          </Box>
          <Rating value={review.rating} readOnly precision={0.5} />
          <Typography variant="body1" sx={{ mt: 1 }}>
            {review.text}
          </Typography>
        </Paper>
      ))}
      {reviews.length === 0 && (
        <Typography variant="body1" color="text.secondary" align="center">
          No reviews yet
        </Typography>
      )}
    </Box>
  );
};

export default ReviewsList; 