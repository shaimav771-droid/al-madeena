import React, { useState, useEffect } from 'react';
import { X, Bike, Check, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CustomSelect from '../common/CustomSelect';

export function calculateMinutes(fromStr, toStr) {
  if (!fromStr || !toStr) return 45;
  try {
    const parseTime = (str) => {
      const match = str.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
      if (!match) return null;
      let hours = parseInt(match[1], 10);
      const minutes = parseInt(match[2], 10);
      const period = match[3] ? match[3].toUpperCase() : null;
      if (period === 'PM' && hours < 12) hours += 12;
      if (period === 'AM' && hours === 12) hours = 0;
      return hours * 60 + minutes;
    };
    const t1 = parseTime(fromStr);
    const t2 = parseTime(toStr);
    if (t1 !== null && t2 !== null) {
      let diff = t2 - t1;
      if (diff < 0) diff += 24 * 60;
      return diff > 0 ? diff : 45;
    }
  } catch (e) {
    // fallback
  }
  return 45;
}

export default function AddBikeClassModal({ isOpen, onClose, preselectedStudentId }) {
  const { students, addBikeClass } = useApp();

  const [studentId, setStudentId] = useState(preselectedStudentId || (students[0]?.id || ''));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [fromTime, setFromTime] = useState('07:00 AM');
  const [toTime, setToTime] = useState('07:45 AM');
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [kmTravelled, setKmTravelled] = useState('8.0');
  const [vehicleDetails, setVehicleDetails] = useState('Hero Splendor Plus');
  const [vehicleNumber, setVehicleNumber] = useState('KL-11-BK-1102');
  const [instructor, setInstructor] = useState('Manoj P.');
  const [remarks, setRemarks] = useState('Figure-of-8 track practice and balance training');
  const [error, setError] = useState('');

  useEffect(() => {
    if (preselectedStudentId) {
      setStudentId(preselectedStudentId);
    }
  }, [preselectedStudentId, isOpen]);

  // Auto-calculate duration whenever fromTime or toTime changes
  useEffect(() => {
    const calc = calculateMinutes(fromTime, toTime);
    if (calc > 0) {
      setDurationMinutes(calc);
    }
  }, [fromTime, toTime]);

  if (!isOpen) return null;

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !selectedStudent) {
      setError('Please select a student');
      return;
    }

    const km = parseFloat(kmTravelled);
    if (isNaN(km) || km <= 0) {
      setError('Please enter a valid KM travelled (e.g. 8.0)');
      return;
    }

    addBikeClass({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      date,
      fromTime: fromTime.trim(),
      toTime: toTime.trim(),
      durationMinutes: parseInt(durationMinutes, 10) || 45,
      kmTravelled: km,
      vehicleDetails: vehicleDetails.trim() || 'Hero Splendor Plus',
      vehicleNumber: vehicleNumber.trim() || 'KL-11-BK-1102',
      traineeSignature: selectedStudent.name,
      instructor: instructor.trim() || 'Manoj P.',
      instructorSignature: instructor.trim() || 'Manoj P.',
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
                Record Bike Class Entry
              </h3>
              <p className="text-xs text-[#5A627A]">
                Log 2-Wheeler practice session & apply ₹300 charge
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

        {/* Notice Banner */}
        <div className="bg-[#FFF8EB] border-b border-[#FBA920]/20 px-6 py-2.5 flex items-center gap-2 text-xs font-semibold text-[#0E113C]">
          <span className="w-2 h-2 rounded-full bg-[#FBA920] shrink-0" />
          <span>
            Business Rule: Each additional Bike Class incurs a standard fee of <strong>₹300</strong>, automatically updated in the student's financial summary.
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 bg-white rounded-b-2xl">
          {error && (
            <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2 border border-red-200">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Student Selector */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Select Student *
            </label>
            <CustomSelect
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              options={students.map((s) => ({
                value: s.id,
                label: `${s.name} (${s.id})`
              }))}
              searchable={true}
              placeholder="Search student..."
            />
          </div>

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
                placeholder="e.g. 8.5"
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
          </div>

          {/* Timing: FROM & TO & DURATION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                From Time *
              </label>
              <input
                type="text"
                value={fromTime}
                onChange={(e) => setFromTime(e.target.value)}
                placeholder="07:00 AM"
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                To Time *
              </label>
              <input
                type="text"
                value={toTime}
                onChange={(e) => setToTime(e.target.value)}
                placeholder="07:45 AM"
                className="w-full bg-[#F6F8FB] focus:bg-white text-xs font-medium text-[#0E113C] px-3 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Time in Min
              </label>
              <input
                type="number"
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(e.target.value)}
                placeholder="45"
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
                placeholder="Hero Splendor Plus / Activa"
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
                placeholder="KL-11-BK-1102"
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
                placeholder="Manoj P."
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
                value={`Signed (${selectedStudent?.name || 'Trainee'})`}
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
              placeholder="e.g. Figure-of-8 track balance, clutch control..."
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
              <span>Save Bike Class (+₹300)</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
