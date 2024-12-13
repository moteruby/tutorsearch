import React from 'react';
import { 
  TextField, 
  Box, 
  Typography,
  Chip,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';

const TutorFields = ({ description, hourlyRate, subjects, onFieldChange }) => {
  const [newSubject, setNewSubject] = React.useState('');

  const handleAddSubject = () => {
    if (newSubject.trim()) {
      onFieldChange('subjects')([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const handleRemoveSubject = (subjectToRemove) => {
    onFieldChange('subjects')(subjects.filter(subject => subject !== subjectToRemove));
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h6" gutterBottom>
        Tutor Information
      </Typography>

      <TextField
        fullWidth
        label="Description"
        multiline
        rows={4}
        value={description}
        onChange={(e) => onFieldChange('description')(e.target.value)}
        sx={{ mb: 2 }}
      />

      <TextField
        fullWidth
        label="Hourly Rate ($)"
        type="number"
        value={hourlyRate}
        onChange={(e) => onFieldChange('hourlyRate')(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          Subjects
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
          <TextField
            size="small"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Add new subject"
          />
          <IconButton onClick={handleAddSubject} color="primary">
            <AddIcon />
          </IconButton>
        </Box>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {subjects.map((subject, index) => (
            <Chip
              key={index}
              label={subject}
              onDelete={() => handleRemoveSubject(subject)}
              deleteIcon={<CloseIcon />}
            />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default TutorFields; 