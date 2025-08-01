'use client';
import React, { useState, useEffect } from 'react';
import { Appointment } from '@/app/redux/dashboardSlice';

interface RescheduleModalProps {
  open: boolean;
  appointment?: Appointment;
  onClose: () => void;
  onSubmit: (appointmentId: number, newDate: string) => Promise<void>;
}

const RescheduleModal: React.FC<RescheduleModalProps> = ({ open, appointment, onClose, onSubmit }) => {
  const [newTime, setNewTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (appointment) {
      setNewTime(appointment.time.slice(0, 16)); // for datetime-local input
    }
  }, [appointment]);

  if (!open || !appointment) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newTime && appointment) {
      setIsSubmitting(true);
      try {
        await onSubmit(appointment.id, new Date(newTime).toISOString());
      } catch (error) {
        console.error('Failed to reschedule:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="relative bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-100 animate-fadeIn">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-xl font-bold focus:outline-none"
          aria-label="Close"
        >
          ×
        </button>
        <form onSubmit={handleSubmit}>
          <h3 className="text-2xl font-bold mb-6 text-gray-900 text-center">Reschedule Appointment</h3>
          <div className="mb-6">
            <label className="block mb-2 text-base font-medium text-gray-700">
              New Date & Time
              <input
                type="datetime-local"
                value={newTime}
                onChange={(e) => setNewTime(e.target.value)}
                required
                className="mt-2 w-full rounded-lg border-gray-300 focus:border-blue-500 focus:ring-blue-500 bg-gray-50 px-3 py-2 text-base"
              />
            </label>
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-medium shadow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RescheduleModal;
