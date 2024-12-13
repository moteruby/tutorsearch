import React from 'react';
import { 
  TextField, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel,
  Box,
  Button,
  InputAdornment,
  IconButton,
  Typography,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const TutorFilters = ({ filters, onFilterChange, onReset }) => {
  const theme = useTheme();

  const handleChange = (field) => (event) => {
    onFilterChange({
      ...filters,
      [field]: event.target.value
    });
  };

  const textFieldStyles = {
    '& .MuiOutlinedInput-root': {
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      transition: 'all 0.3s ease',
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      },
      '&.Mui-focused': {
        backgroundColor: 'rgba(255, 255, 255, 1)',
        '& fieldset': {
          borderColor: theme.palette.secondary.main,
          borderWidth: '2px',
        },
      },
    },
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h6" gutterBottom>
        Filters
      </Typography>
      
      <TextField
        fullWidth
        label="Search"
        value={filters.search}
        onChange={handleChange('search')}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: filters.search && (
            <InputAdornment position="end">
              <IconButton
                onClick={() => onFilterChange({ ...filters, search: '' })}
                edge="end"
                size="small"
              >
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={textFieldStyles}
      />
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2,
        flexWrap: { xs: 'wrap', md: 'nowrap' }
      }}>
        <TextField
          label="Subject"
          variant="outlined"
          value={filters.subject}
          onChange={handleChange('subject')}
          fullWidth
          InputProps={{
            endAdornment: filters.subject && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onFilterChange({ ...filters, subject: '' })}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />
        
        <TextField
          label="Max Hourly Rate ($)"
          type="number"
          variant="outlined"
          value={filters.maxHourlyRate}
          onChange={handleChange('maxHourlyRate')}
          fullWidth
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
            endAdornment: filters.maxHourlyRate && (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => onFilterChange({ ...filters, maxHourlyRate: '' })}
                  edge="end"
                  size="small"
                >
                  <ClearIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={textFieldStyles}
        />
        
        <FormControl fullWidth>
          <InputLabel>Min Rating</InputLabel>
          <Select
            value={filters.minRating}
            label="Min Rating"
            onChange={handleChange('minRating')}
            sx={{
              ...textFieldStyles,
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
            }}
          >
            <MenuItem value="">Any Rating</MenuItem>
            <MenuItem value="4.5">4.5+ ⭐</MenuItem>
            <MenuItem value="4">4.0+ ⭐</MenuItem>
            <MenuItem value="3.5">3.5+ ⭐</MenuItem>
            <MenuItem value="3">3.0+ ⭐</MenuItem>
          </Select>
        </FormControl>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        gap: 2, 
        justifyContent: 'flex-end',
        mt: 1
      }}>
        <Button
          variant="outlined"
          onClick={onReset}
          startIcon={<RefreshIcon />}
          sx={{
            borderColor: theme.palette.secondary.main,
            color: theme.palette.secondary.main,
            '&:hover': {
              borderColor: theme.palette.secondary.dark,
              backgroundColor: 'rgba(43, 122, 120, 0.1)',
            },
          }}
        >
          Reset Filters
        </Button>
        <Button
          variant="contained"
          onClick={() => onFilterChange(filters)}
          sx={{
            background: `linear-gradient(45deg, ${theme.palette.secondary.dark} 30%, ${theme.palette.secondary.main} 90%)`,
            boxShadow: `0 3px 5px 2px ${theme.palette.secondary.main}30`,
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: `0 6px 12px 4px ${theme.palette.secondary.main}20`,
            },
          }}
        >
          Apply Filters
        </Button>
      </Box>
    </Box>
  );
};

export default TutorFilters; 