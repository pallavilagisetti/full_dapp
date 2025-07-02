'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { 
  fetchAppointments, 
  fetchStatusCount, 
  rescheduleAppointmentAsync 
} from '@/app/redux/dashboardSlice';
import { Filters, StatusCount, AppointmentList, RescheduleModal } from '.';
import { Appointment } from '@/app/redux/dashboardSlice';

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.dashboard);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | undefined>(undefined);

  useEffect(() => {
    dispatch(fetchAppointments());
    dispatch(fetchStatusCount());
  }, [dispatch]);

  const handleReschedule = (appt: Appointment) => {
    setSelectedAppt(appt);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppt(undefined);
  };

  const handleRescheduleSubmit = async (appointmentId: number, newDate: string) => {
    try {
      await dispatch(rescheduleAppointmentAsync({ id: appointmentId, time: newDate })).unwrap();
      setModalOpen(false);
      setSelectedAppt(undefined);
      // Refresh data
      dispatch(fetchAppointments());
      dispatch(fetchStatusCount());
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-stretch justify-center py-0 px-2">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full max-w-4xl h-full flex flex-col bg-white/95 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12 border border-gray-100 overflow-auto min-h-[90vh]">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Doctor Dashboard</h1>
            <p className="text-lg text-gray-700 font-medium">Manage your appointments efficiently and professionally</p>
          </div>
          
          {error && (
            <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              Error: {error}
            </div>
          )}
          
          <Filters />
          <StatusCount />
          <AppointmentList onReschedule={handleReschedule} />
          <RescheduleModal 
            open={modalOpen} 
            appointment={selectedAppt} 
            onClose={handleCloseModal}
            onSubmit={handleRescheduleSubmit}
          />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
