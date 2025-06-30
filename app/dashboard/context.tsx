'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react';

export type AppointmentStatus = 'confirmed' | 'pending' | 'completed';

export interface Appointment {
  id: number;
  patientName: string;
  time: string; 
  status: AppointmentStatus;
}

export interface Filter {
  status: AppointmentStatus | 'all';
  startDate: string | null; 
  endDate: string | null; 
}

interface DashboardContextType {
  appointments: Appointment[];
  filteredAppointments: Appointment[];
  filter: Filter;
  setFilter: (filter: Filter) => void;
  markCompleted: (id: number) => void;
  reschedule: (id: number, newTime: string) => void;
  statusCounts: Record<AppointmentStatus, number>;
  setAppointments: (appts: Appointment[]) => void;
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export const useDashboard = () => {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error('useDashboard must be used within DashboardProvider');
  return ctx;
};

export const DashboardProvider = ({ children }: { children: ReactNode }) => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<Filter>({ status: 'all', startDate: null, endDate: null });

  // Filtering logic
  const filteredAppointments = appointments.filter((appt) => {
    const statusMatch = filter.status === 'all' || appt.status === filter.status;
    const date = new Date(appt.time);
    const startMatch = !filter.startDate || date >= new Date(filter.startDate);
    const endMatch = !filter.endDate || date <= new Date(filter.endDate);
    return statusMatch && startMatch && endMatch;
  });

  // Status counts
  const statusCounts: Record<AppointmentStatus, number> = {
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
  };

  // Actions
  const markCompleted = (id: number) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: 'completed' } : a))
    );
  };

  const reschedule = (id: number, newTime: string) => {
    setAppointments((prev) =>
      prev.map((a) => (a.id === id ? { ...a, time: newTime } : a))
    );
  };

  return (
    <DashboardContext.Provider
      value={{
        appointments,
        filteredAppointments,
        filter,
        setFilter,
        markCompleted,
        reschedule,
        statusCounts,
        setAppointments,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}; 