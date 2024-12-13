import React, { useState, useEffect, useCallback } from 'react';
import { Container, Box, Typography, Paper, Grid } from '@mui/material';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import {
  startOfWeek,
  startOfDay,
  endOfDay,
  startOfMonth,
  endOfMonth,
  addDays,
  subDays
} from 'date-fns';
import { useTheme } from '@mui/material/styles';
import Navbar from '../components/Layout/Navbar';
import LessonDetailsModal from '../components/Lessons/LessonDetailsModal';
import api from '../services/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const locales = {
  'en-US': {
    ...enUS,
    week: {
      ...enUS.week,
      day: 'dd',
      week: 'w',
      month: 'MMM',
      year: 'yyyy',
      hour: 'HH',
      minute: 'mm',
    },
    weekdays: {
      long: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      short: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      narrow: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    },
  },
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => 1,
  getDay: (date) => {
    const day = getDay(date);
    return day === 0 ? 6 : day - 1;
  },
  locales,
});

const CalendarPage = () => {
  const theme = useTheme();
  const [currentUser, setCurrentUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calendarView, setCalendarView] = useState('week');

  const loadCurrentUser = async () => {
    try {
      const response = await api.get('/auth/current-user');
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error('Error loading current user:', error);
    }
  };

  const loadLessons = useCallback(async (userId, role, start, end) => {
    try {
      const startDate = startOfDay(start);
      const endDate = endOfDay(end);

      const startStr = startDate.toISOString();
      const endStr = endDate.toISOString();

      const endpoint = role === 'TUTOR'
        ? `/lessons/tutor/${userId}?start=${startStr}&end=${endStr}`
        : `/lessons/student/${userId}?start=${startStr}&end=${endStr}`;

      const response = await api.get(endpoint);
      
      const calendarEvents = response.data.map(lesson => ({
        ...lesson,
        title: `${lesson.subject} with ${role === 'TUTOR' ? lesson.student.username : lesson.tutor.username}`,
        start: new Date(lesson.startTime),
        end: new Date(lesson.endTime),
        backgroundColor: getStatusColor(lesson.status)
      }));

      setEvents(calendarEvents);
    } catch (error) {
      console.error('Error loading lessons:', error);
    }
  }, []);

  const handleRangeChange = useCallback((dates, view) => {
    if (!currentUser) return;

    try {
      let start, end;

      if (Array.isArray(dates)) {
        [start, end] = dates;
      } else if (dates.start && dates.end) {
        start = dates.start;
        end = dates.end;
      } else if (dates) {
        start = startOfDay(dates);
        end = endOfDay(dates);
      }

      start = subDays(startOfDay(start), 1);
      end = addDays(endOfDay(end), 1);

      if (start && end) {
        loadLessons(currentUser.id, currentUser.role, start, end);
      }
    } catch (error) {
      console.error('Error handling range change:', error);
    }
  }, [currentUser, loadLessons]);

  const handleLessonUpdated = useCallback(() => {
    if (!currentUser) return;
    
    const now = new Date();
    let start, end;
    
    switch (calendarView) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = addDays(start, 6);
        break;
      case 'day':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      default: // month
        start = startOfMonth(now);
        end = endOfMonth(now);
    }
    
    loadLessons(currentUser.id, currentUser.role, start, end);
  }, [currentUser, loadLessons, calendarView]);

  const handleSelectEvent = (event) => {
    setSelectedLesson(event);
    setIsModalOpen(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING':
        return '#ffd700';
      case 'APPROVED':
        return '#4caf50';
      case 'REJECTED':
        return '#f44336';
      default:
        return '#2196f3';
    }
  };

  useEffect(() => {
    const initializeCalendar = async () => {
      const userData = await loadCurrentUser();
      if (userData) {
        const now = new Date();
        const start = new Date(now.getFullYear(), now.getMonth(), 1);
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        await loadLessons(userData.id, userData.role, start, end);
      }
    };

    initializeCalendar();
  }, [loadLessons]);

  const eventStyleGetter = (event) => {
    let backgroundColor = theme.palette.secondary.main;
    let borderColor = theme.palette.secondary.dark;

    switch (event.status) {
      case 'PENDING':
        backgroundColor = theme.palette.warning.main;
        borderColor = theme.palette.warning.dark;
        break;
      case 'APPROVED':
        backgroundColor = theme.palette.success.main;
        borderColor = theme.palette.success.dark;
        break;
      case 'REJECTED':
        backgroundColor = theme.palette.error.main;
        borderColor = theme.palette.error.dark;
        break;
      case 'COMPLETED':
        backgroundColor = theme.palette.grey[600];
        borderColor = theme.palette.grey[800];
        break;
      default:
        break;
    }

    return {
      style: {
        backgroundColor,
        borderColor,
        borderRadius: '8px',
        opacity: 0.8,
        color: '#fff',
        border: 'none',
        padding: '4px 8px',
        fontWeight: 500,
        transition: 'all 0.3s ease',
        '&:hover': {
          opacity: 1,
          transform: 'scale(1.02)',
        },
      },
    };
  };

  const handleNavigate = useCallback((date, view) => {
    if (!currentUser) return;

    let start, end;
    
    switch (view) {
      case 'week':
        start = startOfWeek(date, { weekStartsOn: 1 });
        end = addDays(start, 6);
        break;
      case 'day':
        start = startOfDay(date);
        end = endOfDay(date);
        break;
      default: // month
        start = startOfMonth(date);
        end = endOfMonth(date);
    }

    loadLessons(currentUser.id, currentUser.role, start, end);
  }, [currentUser, loadLessons]);

  const handleViewChange = useCallback((view) => {
    if (!currentUser) return;
    setCalendarView(view);

    const now = new Date();
    let start, end;
    
    switch (view) {
      case 'week':
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = addDays(start, 6);
        break;
      case 'day':
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      default: // month
        start = startOfMonth(now);
        end = endOfMonth(now);
    }

    loadLessons(currentUser.id, currentUser.role, start, end);
  }, [currentUser, loadLessons]);

  return (
    <Box sx={{ minHeight: '100vh', background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)` }}>
      <Navbar user={currentUser} />
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3} justifyContent="center">
          <Grid item xs={12}>
            <Paper elevation={24} sx={{ p: 4, borderRadius: 4 }}>
              <Typography variant="h4" gutterBottom sx={{ color: theme.palette.primary.main }}>
                Schedule
              </Typography>
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 'calc(100vh - 300px)' }}
                eventPropGetter={eventStyleGetter}
                onSelectEvent={(event) => {
                  setSelectedLesson(event);
                  setIsModalOpen(true);
                }}
                views={['month', 'week', 'day']}
                defaultView="week"
                step={30}
                timeslots={1}
                min={new Date(0, 0, 0, 8, 0, 0)}
                max={new Date(0, 0, 0, 22, 0, 0)}
                formats={{
                  timeGutterFormat: 'HH:mm',
                  eventTimeRangeFormat: ({ start, end }) =>
                    `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
                  dayRangeHeaderFormat: ({ start, end }) =>
                    `${format(start, 'MMM d')} - ${format(end, 'MMM d')}`,
                  dayHeaderFormat: (date) => format(date, 'EEE'),
                  weekdayFormat: (date) => format(date, 'EEE'),
                }}
                firstDayOfWeek={1}
                messages={{
                  week: 'Week',
                  day: 'Day',
                  month: 'Month',
                  previous: 'Back',
                  next: 'Next',
                  today: 'Today',
                  agenda: 'Agenda',
                  allDay: 'All Day',
                  date: 'Date',
                  time: 'Time',
                  event: 'Event',
                  noEventsInRange: 'No events in this range.',
                }}
              />
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <LessonDetailsModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        lesson={selectedLesson}
        currentUser={currentUser}
        onLessonUpdated={loadLessons}
      />

      <Box
        sx={{
          position: 'fixed',
          top: '20%',
          left: '-5%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: theme.palette.secondary.main,
          opacity: 0.1,
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
      <Box
        sx={{
          position: 'fixed',
          bottom: '10%',
          right: '-5%',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: theme.palette.primary.light,
          opacity: 0.1,
          filter: 'blur(60px)',
          zIndex: 0,
        }}
      />
    </Box>
  );
};

export default CalendarPage; 