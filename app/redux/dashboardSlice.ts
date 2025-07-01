
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Appointment {
  id: number;
  patientName: string;
  time: string;
  status: 'confirmed' | 'pending' | 'completed';
}

export interface FilterState {
  status: string;
  startDate: string | null;
  endDate: string | null;
}

interface DashboardState {
  appointments: Appointment[];
  filter: FilterState;
}

const initialState: DashboardState = {
  appointments: [],
  filter: {
    status: 'all',
    startDate: null,
    endDate: null,
  },
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setAppointments(state, action: PayloadAction<Appointment[]>) {
      state.appointments = action.payload;
    },
    setFilter(state, action: PayloadAction<FilterState>) {
      state.filter = action.payload;
    },
    markCompleted(state, action: PayloadAction<number>) {
      const appt = state.appointments.find((a) => a.id === action.payload);
      if (appt) {
        appt.status = 'completed';
      }
    },
    rescheduleAppointment(
      state,
      action: PayloadAction<{ id: number; newDate: string }>
    ) {
      const appt = state.appointments.find((a) => a.id === action.payload.id);
      if (appt) {
        appt.time = action.payload.newDate;
      }
    },
  },
});

export const {
  setAppointments,
  setFilter,
  markCompleted,
  rescheduleAppointment,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
