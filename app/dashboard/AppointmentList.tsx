'use client';
import React from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { markCompleted } from '@/app/redux/dashboardSlice';
import { Appointment } from '@/app/type';

interface AppointmentListProps {
  onReschedule: (appt: Appointment) => void;
}

const statusColors = {
  confirmed: 'border-blue-500',
  pending: 'border-yellow-500',
  completed: 'border-green-500',
};

const statusIcons = {
  confirmed: '✅',
  pending: '⏳',
  completed: '✔️',
};

const AppointmentList: React.FC<AppointmentListProps> = ({ onReschedule }) => {
  const dispatch = useAppDispatch();
  const appointments = useAppSelector((state) => state.dashboard.appointments);
  const filter = useAppSelector((state) => state.dashboard.filter);

  const filteredAppointments = appointments.filter((appt) => {
    const statusMatch =
      filter.status === 'all' ? true : appt.status === filter.status;

    const startDateMatch = filter.startDate
      ? new Date(appt.time) >= new Date(filter.startDate)
      : true;

    const endDateMatch = filter.endDate
      ? new Date(appt.time) <= new Date(filter.endDate)
      : true;

    return statusMatch && startDateMatch && endDateMatch;
  });

  if (filteredAppointments.length === 0) {
    return <div className="text-center text-gray-400 py-8">No appointments found.</div>;
  }

  return (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
      {filteredAppointments.map((appt) => (
        <div
          key={appt.id}
          className={`relative bg-white rounded-xl shadow-md p-6 flex flex-col border-l-8 ${
            statusColors[appt.status]
          } transition hover:shadow-lg`}
        >
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">{statusIcons[appt.status]}</span>
            <span className="font-semibold text-lg text-gray-900">{appt.patientName}</span>
          </div>
          <div className="text-sm text-gray-500 mb-1">{new Date(appt.time).toLocaleString()}</div>
          <div className="text-sm mb-4 text-gray-700">
            Status: <span className="font-bold capitalize">{appt.status}</span>
          </div>
          <div className="flex gap-2 mt-auto">
            {appt.status !== 'completed' && (
              <button
                onClick={() => dispatch(markCompleted(appt.id))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-500 text-white hover:bg-green-600 focus:ring-2 focus:ring-green-300 transition font-medium text-sm shadow"
              >
                <span>✔️</span> Mark as Completed
              </button>
            )}
            <button
              onClick={() => onReschedule(appt)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 transition font-medium text-sm shadow"
            >
              <span>🕒</span> Reschedule
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AppointmentList;
