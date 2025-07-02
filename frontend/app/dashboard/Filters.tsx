'use client';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/redux/hooks';
import { setFilter, fetchAppointments } from '@/app/redux/dashboardSlice';

const statusOptions = ['all', 'confirmed', 'pending', 'completed'] as const;

const Filters = () => {
  const dispatch = useAppDispatch();
  const filter = useAppSelector((state) => state.dashboard.filter);

  const handleChange = (key: string, value: string | null) => {
    const newFilter = { ...filter, [key]: value };
    dispatch(setFilter(newFilter));
  };

  // Trigger API call when filters change
  useEffect(() => {
    const filters = {
      status: filter.status === 'all' ? undefined : filter.status,
      startDate: filter.startDate || undefined,
      endDate: filter.endDate || undefined,
    };
    dispatch(fetchAppointments(filters));
  }, [filter, dispatch]);

  return (
    <div className="filters bg-white/80 rounded-xl shadow flex flex-wrap gap-4 mb-8 px-4 py-4 items-end border border-gray-100">
      <label className="flex flex-col text-base flex-1 min-w-[140px]">
        <span className="mb-1 font-medium flex items-center gap-1 text-gray-700">🗂 Status</span>
        <select
          className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 text-gray-700 focus:ring-blue-500 bg-gray-50 px-3 py-2 text-base"
          value={filter.status}
          onChange={(e) => handleChange('status', e.target.value)}
        >
          {statusOptions.map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col text-base flex-1 min-w-[140px]">
        <span className="mb-1 font-medium flex items-center gap-1 text-gray-700">📅 Start Date</span>
        <input
          className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 text-gray-700 focus:ring-blue-500 bg-gray-50 px-3 py-2 text-base"
          type="date"
          value={filter.startDate ? filter.startDate.slice(0, 10) : ''}
          onChange={(e) => handleChange('startDate', e.target.value || null)}
        />
      </label>

      <label className="flex flex-col text-base flex-1 min-w-[140px]">
        <span className="mb-1 font-medium flex items-center gap-1 text-gray-700">📅 End Date</span>
        <input
          className="mt-1 rounded-lg border-gray-300 focus:border-blue-500 text-gray-700 focus:ring-blue-500 bg-gray-50 px-3 py-2 text-base"
          type="date"
          value={filter.endDate ? filter.endDate.slice(0, 10) : ''}
          onChange={(e) => handleChange('endDate', e.target.value || null)}
        />
      </label>
    </div>
  );
};

export default Filters;
