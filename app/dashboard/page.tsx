'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/app/redux/hooks';
import { setAppointments } from '@/app/redux/dashboardSlice';
import { Filters, StatusCount, AppointmentList, RescheduleModal } from '.';
import { Appointment } from '@/app/redux/dashboardSlice';

const fetchAppointments = async (): Promise<Appointment[]> => {
  return [
    {
      id: 1,
      patientName: 'John Doe',
      time: new Date().toISOString(),
      status: 'confirmed',
    },
    {
      id: 2,
      patientName: 'Jane Smith',
      time: new Date(Date.now() + 3600 * 1000).toISOString(),
      status: 'pending',
    },
    {
      id: 3,
      patientName: 'Alice Brown',
      time: new Date(Date.now() + 7200 * 1000).toISOString(),
      status: 'completed',
    },
  ];
};

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAppt, setSelectedAppt] = useState<Appointment | undefined>(undefined);

  useEffect(() => {
    fetchAppointments().then((data) => dispatch(setAppointments(data)));
  }, [dispatch]);

  const handleReschedule = (appt: Appointment) => {
    setSelectedAppt(appt);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedAppt(undefined);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-white to-indigo-100 flex items-stretch justify-center py-0 px-2">
      <div className="flex flex-col justify-center items-center w-full">
        <div className="w-full max-w-4xl h-full flex flex-col bg-white/95 rounded-2xl shadow-2xl p-4 sm:p-8 md:p-12 border border-gray-100 overflow-auto min-h-[90vh]">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-2 tracking-tight">Doctor Dashboard</h1>
            <p className="text-lg text-gray-700 font-medium">Manage your appointments efficiently and professionally</p>
          </div>
          <Filters />
          <StatusCount />
          <AppointmentList onReschedule={handleReschedule} />
          <RescheduleModal open={modalOpen} appointment={selectedAppt} onClose={handleCloseModal} />
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
