
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { apiService } from '@/app/services/api';

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
  loading: boolean;
  error: string | null;
  statusCount: {
    confirmed: number;
    pending: number;
    completed: number;
  };
}

const initialState: DashboardState = {
  appointments: [],
  filter: {
    status: 'all',
    startDate: null,
    endDate: null,
  },
  loading: false,
  error: null,
  statusCount: {
    confirmed: 0,
    pending: 0,
    completed: 0,
  },
};

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'dashboard/fetchAppointments',
  async (filters?: { status?: string; startDate?: string; endDate?: string }) => {
    const response = await apiService.getAppointments(filters);
    return response;
  }
);

export const fetchStatusCount = createAsyncThunk(
  'dashboard/fetchStatusCount',
  async () => {
    const response = await apiService.getStatusCount();
    return response;
  }
);

export const updateAppointmentStatus = createAsyncThunk(
  'dashboard/updateAppointmentStatus',
  async ({ id, status }: { id: number; status: 'confirmed' | 'pending' | 'completed' }) => {
    const response = await apiService.updateAppointment(id, { status });
    return response;
  }
);

export const rescheduleAppointmentAsync = createAsyncThunk(
  'dashboard/rescheduleAppointment',
  async ({ id, time }: { id: number; time: string }) => {
    const response = await apiService.updateAppointment(id, { time });
    return response;
  }
);

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
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch appointments
    builder
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch appointments';
      });

    // Fetch status count
    builder
      .addCase(fetchStatusCount.fulfilled, (state, action) => {
        state.statusCount = action.payload;
      });

    // Update appointment status
    builder
      .addCase(updateAppointmentStatus.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });

    // Reschedule appointment
    builder
      .addCase(rescheduleAppointmentAsync.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
      });
  },
});

export const {
  setAppointments,
  setFilter,
  clearError,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
