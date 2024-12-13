import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Rating, 
  TextField, 
  Button 
} from '@mui/material';
import api from '../../services/api';

const ReviewForm = ({ tutorId, currentUserReview, onReviewSubmitted }) => {
  const [rating, setRating] = useState(currentUserReview?.rating || 0);
  const [text, setText] = useState(currentUserReview?.text || '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      console.log('Current user:', currentUser);

      if (!currentUser || !currentUser.id) {
        try {
          const response = await api.get('/auth/current-user');
          const userData = response.data;
          localStorage.setItem('user', JSON.stringify(userData));
          currentUser = userData;
        } catch (error) {
          console.error('Failed to refresh user data:', error);
          alert('Please log in again');
          return;
        }
      }

      const reviewData = {
        tutorId,
        studentId: currentUser.id,
        rating,
        text
      };

      console.log('Sending review data:', reviewData);

      if (currentUserReview) {
        await api.put(`/reviews/${currentUserReview.id}`, reviewData);
      } else {
        await api.post('/reviews', reviewData);
      }

      onReviewSubmitted();
    } catch (error) {
      console.error('Full error:', error);
      console.error('Error details:', error.response?.data);
      alert('Failed to submit review. Please try again.');
    }
  };

  const handleDelete = async () => {
    if (!currentUserReview || !window.confirm('Are you sure you want to delete your review?')) {
      return;
    }

    try {
      await api.delete(`/reviews/${currentUserReview.id}`);
      onReviewSubmitted();
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('Failed to delete review');
    }
  };

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h6" gutterBottom>
        {currentUserReview ? 'Edit Your Review' : 'Write a Review'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Rating</Typography>
          <Rating
            value={rating}
            onChange={(_, newValue) => setRating(newValue)}
            precision={0.5}
            size="large"
          />
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write your review here..."
          sx={{ mb: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button 
            type="submit" 
            variant="contained" 
            color="primary"
          >
            {currentUserReview ? 'Update Review' : 'Submit Review'}
          </Button>
          {currentUserReview && (
            <Button 
              variant="outlined" 
              color="error" 
              onClick={handleDelete}
            >
              Delete Review
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default ReviewForm; 