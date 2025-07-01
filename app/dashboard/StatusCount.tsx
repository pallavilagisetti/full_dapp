'use client';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';

const statusStyles = {
  confirmed: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-green-100 text-green-800',
};

const statusIcons = {
  confirmed: '✅',
  pending: '⏳',
  completed: '✔️',
};

const StatusCount = () => {
  const appointments = useSelector((state: RootState) => state.dashboard.appointments);

  const statusCounts = appointments.reduce(
    (acc, appt) => {
      acc[appt.status] += 1;
      return acc;
    },
    {
      confirmed: 0,
      pending: 0,
      completed: 0,
    }
  );

  return (
    <div className="flex gap-4 mb-8 justify-center">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-base shadow-sm ${statusStyles.confirmed}`}>
        <span>{statusIcons.confirmed}</span> Confirmed: <b>{statusCounts.confirmed}</b>
      </div>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-base shadow-sm ${statusStyles.pending}`}>
        <span>{statusIcons.pending}</span> Pending: <b>{statusCounts.pending}</b>
      </div>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium text-base shadow-sm ${statusStyles.completed}`}>
        <span>{statusIcons.completed}</span> Completed: <b>{statusCounts.completed}</b>
      </div>
    </div>
  );
};

export default StatusCount;
