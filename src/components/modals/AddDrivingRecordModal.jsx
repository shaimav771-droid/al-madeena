import React, { useState, useEffect } from 'react';
import { X, Car, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CLASS_MODES } from '../../data/initialData';
import CustomSelect from '../common/CustomSelect';

export default function AddDrivingRecordModal({ isOpen, onClose, preselectedStudentId }) {
  const { students, addDrivingRecord } = useApp();

  const [studentId, setStudentId] = useState(preselectedStudentId || (students[0]?.id || ''));
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState('LMV');
  const [startTime, setStartTime] = useState('07:30 AM');
  const [endTime, setEndTime] = useState('08:30 AM');
  const [kmTravelled, setKmTravelled] = useState('14');
  const [vehicleDetails, setVehicleDetails] = useState('Maruti Suzuki Swift');
  const [vehicleNumber, setVehicleNumber] = useState('KL-11-AB-1234');
  const [practiceDetails, setPracticeDetails] = useState('Highway driving, gear shifts and lane control');
  const [instructor, setInstructor] = useState('Rajesh K.');
  const [remarks, setRemarks] = useState('Session completed successfully.');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (preselectedStudentId) {
      setStudentId(preselectedStudentId);
    }
  }, [preselectedStudentId, isOpen]);

  if (!isOpen) return null;

  const handleStudentChange = (e) => {
    const id = e.target.value;
    setStudentId(id);
    setCategory('LMV');
    setVehicleDetails('Maruti Suzuki Swift');
    setVehicleNumber('KL-11-AB-1234');
    setInstructor('Rajesh K.');
  };

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !selectedStudent) {
      setErrors({ student: 'Please select a student' });
      return;
    }

    addDrivingRecord({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      category,
      date,
      startTime,
      endTime,
      kmTravelled: parseFloat(kmTravelled) || 0,
      classOfMode: category === 'Heavy Vehicle' ? 'Heavy Vehicle (HMV)' : '4-Wheeler (LMV)',
      vehicleDetails: vehicleDetails.trim() || 'Maruti Suzuki Swift',
      vehicleNumber: vehicleNumber.trim() || 'KL-11-AB-1234',
      practiceDetails: practiceDetails.trim() || remarks.trim(),
      traineeSignature: selectedStudent.name,
      instructor: instructor.trim() || 'Rajesh K.',
      instructorSignature: instructor.trim() || 'Rajesh K.',
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
              <Car className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Add Car / Driving Practice Record
              </h3>
              <p className="text-xs text-[#5A627A]">
                Log completed road practice session mileage & attendance
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
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Select Student *
            </label>
            <CustomSelect
              value={studentId}
              onChange={handleStudentChange}
              options={students.map((st) => ({
                value: st.id,
                label: `${st.name} (${st.id})`,
                subtext: st.classOfMode,
              }))}
              searchable={true}
              className="py-2"
              error={!!errors.student}
            />
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Driving Category *
              </label>
              <CustomSelect
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                options={[
                  { value: 'LMV', label: 'LMV – Light Motor Vehicle (Car)' }
                ]}
                className="py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Starting Time
              </label>
              <input
                type="text"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                placeholder="07:30 AM"
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono font-medium"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Ending Time
              </label>
              <input
                type="text"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                placeholder="08:30 AM"
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono font-medium"
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
                className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-bold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Vehicle Details
              </label>
              <input
                type="text"
                value={vehicleDetails}
                onChange={(e) => setVehicleDetails(e.target.value)}
                placeholder="Maruti Suzuki Swift"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
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
                placeholder="KL-11-AB-1234"
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Instructor
              </label>
              <input
                type="text"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                placeholder="Rajesh K."
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
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
                className="w-full px-3.5 py-2 text-xs bg-[#EEF0F8] rounded-xl border border-[#E2E8F0] text-[#0E113C] font-semibold cursor-not-allowed"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Class / Practice Details
            </label>
            <input
              type="text"
              value={practiceDetails}
              onChange={(e) => setPracticeDetails(e.target.value)}
              placeholder="e.g. Highway driving, uphill start, parallel parking..."
              className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Remarks
            </label>
            <textarea
              rows="2"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="Instructor remarks..."
              className="w-full p-3 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] resize-none"
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
              <span>Save Practice Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
