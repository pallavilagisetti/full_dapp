
export type AppointmentStatus = 'confirmed' | 'pending' | 'completed';

export interface Appointment {
  id: number;
  patientName: string;
  time: string; // ISO string
  status: AppointmentStatus;
}

export interface FilterState {
  status: 'all' | AppointmentStatus;
  startDate: string | null;
  endDate: string | null;
}
