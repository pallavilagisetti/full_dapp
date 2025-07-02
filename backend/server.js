const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
require('dotenv').config({ path: './config.env' });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Dummy data - in-memory storage
let appointments = [
  {
    id: 1,
    patientName: "John Doe",
    time: "2024-01-15T10:00:00.000Z",
    status: "confirmed"
  },
  {
    id: 2,
    patientName: "Jane Smith",
    time: "2024-01-15T14:30:00.000Z",
    status: "pending"
  },
  {
    id: 3,
    patientName: "Mike Johnson",
    time: "2024-01-16T09:00:00.000Z",
    status: "completed"
  },
  {
    id: 4,
    patientName: "Sarah Wilson",
    time: "2024-01-16T11:00:00.000Z",
    status: "confirmed"
  },
  {
    id: 5,
    patientName: "David Brown",
    time: "2024-01-17T13:00:00.000Z",
    status: "pending"
  }
];

// Routes
app.get('/', (req, res) => {
  res.json({ 
    message: 'Doctor Appointment API is running!',
    version: '1.0.0'
  });
});

// Get all appointments
app.get('/api/appointments', (req, res) => {
  try {
    const { status, startDate, endDate } = req.query;
    
    let filteredAppointments = [...appointments];
    
    // Filter by status
    if (status && status !== 'all') {
      filteredAppointments = filteredAppointments.filter(app => app.status === status);
    }
    
    // Filter by date range
    if (startDate) {
      filteredAppointments = filteredAppointments.filter(app => 
        new Date(app.time) >= new Date(startDate)
      );
    }
    
    if (endDate) {
      filteredAppointments = filteredAppointments.filter(app => 
        new Date(app.time) <= new Date(endDate)
      );
    }
    
    res.json({
      success: true,
      data: filteredAppointments,
      count: filteredAppointments.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments',
      error: error.message
    });
  }
});

// Get appointment by ID
app.get('/api/appointments/:id', (req, res) => {
  try {
    const appointment = appointments.find(app => app.id === parseInt(req.params.id));
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    res.json({
      success: true,
      data: appointment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment',
      error: error.message
    });
  }
});

// Create new appointment
app.post('/api/appointments', (req, res) => {
  try {
    const { patientName, time, status = 'pending' } = req.body;
    
    if (!patientName || !time) {
      return res.status(400).json({
        success: false,
        message: 'Patient name and time are required'
      });
    }
    
    const newAppointment = {
      id: appointments.length > 0 ? Math.max(...appointments.map(app => app.id)) + 1 : 1,
      patientName,
      time,
      status
    };
    
    appointments.push(newAppointment);
    
    res.status(201).json({
      success: true,
      data: newAppointment,
      message: 'Appointment created successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating appointment',
      error: error.message
    });
  }
});

// Update appointment
app.put('/api/appointments/:id', (req, res) => {
  try {
    const { patientName, time, status } = req.body;
    const appointmentIndex = appointments.findIndex(app => app.id === parseInt(req.params.id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    appointments[appointmentIndex] = {
      ...appointments[appointmentIndex],
      ...(patientName && { patientName }),
      ...(time && { time }),
      ...(status && { status })
    };
    
    res.json({
      success: true,
      data: appointments[appointmentIndex],
      message: 'Appointment updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating appointment',
      error: error.message
    });
  }
});

// Delete appointment
app.delete('/api/appointments/:id', (req, res) => {
  try {
    const appointmentIndex = appointments.findIndex(app => app.id === parseInt(req.params.id));
    
    if (appointmentIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }
    
    const deletedAppointment = appointments.splice(appointmentIndex, 1)[0];
    
    res.json({
      success: true,
      data: deletedAppointment,
      message: 'Appointment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting appointment',
      error: error.message
    });
  }
});

// Get appointment statistics
app.get('/api/appointments/stats/status-count', (req, res) => {
  try {
    const statusCount = appointments.reduce((acc, appointment) => {
      acc[appointment.status] = (acc[appointment.status] || 0) + 1;
      return acc;
    }, {});
    
    res.json({
      success: true,
      data: statusCount
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching status count',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}`);
  console.log(`🔗 CORS enabled for: ${process.env.CORS_ORIGIN || 'http://localhost:3000'}`);
}); 