import React, { useState, useEffect } from 'react';
import { X, Bike, Check, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { calculateMinutes } from './AddBikeClassModal';

export default function EditBikeClassModal({ isOpen, onClose, bikeClass }) {
  const { updateBikeClass } = useApp();

  const [date, setDate] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [toTime, setToTime] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [kmTravelled, setKmTravelled] = useState('');
  const [vehicleDetails, setVehicleDetails] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [instructor, setInstructor] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (bikeClass) {
      setDate(bikeClass.date || '');
      setFromTime(bikeClass.fromTime || '07:00 AM');
      setToTime(bikeClass.toTime || '07:45 AM');
      setDurationMinutes(bikeClass.durationMinutes || 45);
      setKmTravelled(bikeClass.kmTravelled ? bikeClass.kmTravelled.toString() : '8.0');
      setVehicleDetails(bikeClass.vehicleDetails || 'Hero Splendor Plus');
      setVehicleNumber(bikeClass.vehicleNumber || 'KL-11-BK-1102');
      setInstructor(bikeClass.instructor || 'Manoj P.');
      setRemarks(bikeClass.remarks || '');
      setError('');
    }
  }, [bikeClass, isOpen]);

  // Recalculate duration if time changes
  const handleFromChange = (val) => {
    setFromTime(val);
    const calc = calculateMinutes(val, toTime);
    if (calc > 0) setDurationMinutes(calc);
  };

  const handleToChange = (val) => {
    setToTime(val);
    const calc = calculateMinutes(fromTime, val);
    if (calc > 0) setDurationMinutes(calc);
  };

  if (!isOpen || !bikeClass) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const km = parseFloat(kmTravelled);
    if (isNaN(km) || km <= 0) {
      setError('Please enter a valid KM travelled (e.g. 8.0)');
      return;
    }

    updateBikeClass(bikeClass.id, {
      date,
      fromTime: fromTime.trim(),
      toTime: toTime.trim(),
      durationMinutes: parseInt(durationMinutes, 10) || 45,
      kmTravelled: km,
      vehicleDetails: vehicleDetails.trim(),
      vehicleNumber: vehicleNumber.trim(),
      instructor: instructor.trim(),
      instructorSignature: instructor.trim(),
      remarks: remarks.trim()
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070926]/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] my-8 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <Bike className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Edit Bike Class Entry
              </h3>
              <p className="text-xs text-[#5A627A]">
                Student: {bikeClass.studentName} ({bikeClass.id})
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-b-2xl">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Date & KM */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                KM Travelled *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={kmTravelled}
                onChange={(e) => setKmTravelled(e.target.value)}
                required
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
          </div>

          {/* Timing: FROM & TO & DURATION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                From Time
              </label>
              <input
                type="text"
                value={fromTime}
                onChange={(e) => handleFromChange(e.target.value)}
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                To Time
              </label>
              <input
                type="text"
                value={toTime}
                onChange={(e) => handleToChange(e.target.value)}
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Duration (Min)
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-bold text-[#0E113C] px-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
          </div>

          {/* Vehicle Details & Number */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Vehicle Details
              </label>
              <input
                type="text"
                value={vehicleDetails}
                onChange={(e) => setVehicleDetails(e.target.value)}
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Vehicle Number
              </label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
          </div>

          {/* Instructor & Signatures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Instructor
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Trainee Signature Status
              </label>
              <input
                type="text"
                readOnly
                value={`Signed (${bikeClass.studentName})`}
                className="w-full bg-[#EEF0F8] text-xs font-semibold text-[#0E113C] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] cursor-not-allowed"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Remarks / Practice Notes
            </label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] p-3 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs font-bold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <Check className="w-4 h-4 text-[#0E113C]" />
              <span>Update Entry</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
