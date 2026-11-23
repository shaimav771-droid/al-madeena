import React, { useState, useRef, useEffect, useMemo } from 'react';
import { X, Clock, Search, Check, ChevronDown } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CLASS_MODES, INSTRUCTORS, VEHICLE_MODELS } from '../../data/initialData';
import AlarmTimeSelector from '../common/AlarmTimeSelector';
import CustomSelect from '../common/CustomSelect';
import InputSelect from '../common/InputSelect';

export default function AddDrivingClassModal({ isOpen, onClose }) {
  const { students, drivingRecords, addDrivingRecord } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startTime, setStartTime] = useState('08:00 AM');
  const [endTime, setEndTime] = useState('09:00 AM');
  const [kmTravelled, setKmTravelled] = useState('12');
  const [classOfRule, setClassOfRule] = useState('4-Wheeler (LMV)');
  const [instructor, setInstructor] = useState('');
  const [vehicleModel, setVehicleModel] = useState('');
  const [error, setError] = useState('');

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedStudent(null);
      setIsDropdownOpen(false);
      setStartTime('08:00 AM');
      setEndTime('09:00 AM');
      setKmTravelled('12');
      setClassOfRule('4-Wheeler (LMV)');
      setInstructor('');
      setVehicleModel('');
      setError('');
    }
  }, [isOpen]);

  const instructorOptions = useMemo(() => {
    const set = new Set(INSTRUCTORS || []);
    drivingRecords?.forEach((r) => {
      if (r.instructor) set.add(r.instructor);
    });
    return Array.from(set);
  }, [drivingRecords]);

  const vehicleOptions = useMemo(() => {
    const set = new Set(VEHICLE_MODELS || []);
    drivingRecords?.forEach((r) => {
      if (r.vehicleModel) set.add(r.vehicleModel);
      if (r.vehicleDetails) set.add(r.vehicleDetails);
    });
    return Array.from(set);
  }, [drivingRecords]);

  if (!isOpen) return null;

  // Filter students for searchable dropdown
  const filteredStudents = students.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.name.toLowerCase().includes(q) ||
      s.id.toLowerCase().includes(q) ||
      (s.phone1 && s.phone1.includes(q)) ||
      (s.classOfMode && s.classOfMode.toLowerCase().includes(q))
    );
  }).slice(0, 10);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setIsDropdownOpen(false);
    setError('');
    if (student.classOfMode) {
      setClassOfRule(student.classOfMode);
    }
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchQuery('');
    setIsDropdownOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedStudent) {
      setError('Please search and select a student');
      return;
    }

    const km = parseFloat(kmTravelled);
    if (isNaN(km) || km <= 0) {
      setError('Please enter a valid KM travelled (e.g. 10)');
      return;
    }

    if (!startTime.trim() || !endTime.trim()) {
      setError('Please provide valid starting and ending times');
      return;
    }

    const finalInstructor = instructor.trim() || 'Rajesh K.';
    const finalVehicleModel = vehicleModel.trim() || 'Maruti Swift';

    addDrivingRecord({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      date: new Date().toISOString().split('T')[0],
      startTime: startTime.trim(),
      endTime: endTime.trim(),
      kmTravelled: km,
      classOfMode: classOfRule,
      instructor: finalInstructor,
      instructorSignature: finalInstructor,
      vehicleModel: finalVehicleModel,
      vehicleDetails: finalVehicleModel,
      remarks: 'Daily driving practice session logged'
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070926]/70 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <Clock className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Add Today's Driving Class
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 rounded-b-2xl bg-white">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-bold">
              {error}
            </div>
          )}

          {/* Student Name - Searchable input / dropdown */}
          <div ref={dropdownRef} className="relative">
            <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
              Student Name *
            </label>

            {selectedStudent ? (
              <div className="flex items-center justify-between p-2.5 bg-[#FFF8EB] border border-[#FBA920]/40 rounded-xl">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-[#0E113C] text-[#FBA920] text-xs font-extrabold flex items-center justify-center">
                    {selectedStudent.name.charAt(0)}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#0E113C]">
                      {selectedStudent.name}
                    </div>
                    <div className="text-[11px] text-[#5A627A]">
                      {selectedStudent.id} • {selectedStudent.classOfMode || selectedStudent.classOfRule}
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleClearStudent}
                  className="px-2.5 py-1 text-xs text-[#0E113C] hover:bg-[#FBA920]/20 rounded-md transition-colors cursor-pointer font-bold"
                >
                  Change
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsDropdownOpen(true);
                  }}
                  onFocus={() => setIsDropdownOpen(true)}
                  placeholder="Search student by name, ID or mobile..."
                  className="w-full pl-10 pr-9 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 transition-all placeholder:text-[#94A3B8] font-medium"
                />
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A627A] hover:text-[#0E113C]"
                >
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute left-0 right-0 mt-1 max-h-56 overflow-y-auto bg-white rounded-xl shadow-xl border border-[#E2E8F0] z-50 py-1">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-[#5A627A] uppercase tracking-wider bg-[#F6F8FB]">
                      Select Student ({filteredStudents.length})
                    </div>
                    {filteredStudents.length === 0 ? (
                      <div className="px-4 py-3 text-xs text-[#94A3B8] text-center">
                        No students found matching "{searchQuery}"
                      </div>
                    ) : (
                      filteredStudents.map((st) => (
                        <div
                          key={st.id}
                          onClick={() => handleSelectStudent(st)}
                          className="px-3.5 py-2 hover:bg-[#FFF8EB] cursor-pointer flex items-center justify-between text-xs transition-colors border-b border-[#F6F8FB] last:border-0"
                        >
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full bg-[#EEF0F8] text-[#0E113C] text-[10px] font-extrabold flex items-center justify-center">
                              {st.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-bold text-[#0E113C]">{st.name}</div>
                              <div className="text-[10px] text-[#5A627A]">
                                {st.id} • {st.phone1 || 'No Phone'}
                              </div>
                            </div>
                          </div>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-[#FFF8EB] text-[#0E113C] font-semibold border border-[#FBA920]/30">
                            {st.classOfMode || st.classOfRule}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Time Fields: Starting Time & Ending Time (Alarm-style time selectors) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Starting Time *
              </label>
              <AlarmTimeSelector
                id="starting-time"
                value={startTime}
                onChange={setStartTime}
                ariaLabelPrefix="Starting Time"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Ending Time *
              </label>
              <AlarmTimeSelector
                id="ending-time"
                value={endTime}
                onChange={setEndTime}
                ariaLabelPrefix="Ending Time"
              />
            </div>
          </div>

          {/* KM Travelled & Class of Rule */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-20">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                KM Travelled *
              </label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={kmTravelled}
                onChange={(e) => setKmTravelled(e.target.value)}
                placeholder="e.g. 12"
                required
                className="w-full px-3.5 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 transition-all font-extrabold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Class of Rule *
              </label>
              <CustomSelect
                value={classOfRule}
                onChange={(e) => setClassOfRule(e.target.value)}
                options={CLASS_MODES}
              />
            </div>
          </div>

          {/* Instructor & Vehicle Model */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 relative z-10">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Instructor
              </label>
              <InputSelect
                id="driving-class-instructor"
                value={instructor}
                onChange={(e) => setInstructor(e.target.value)}
                options={instructorOptions}
                placeholder="Enter or select instructor name"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Vehicle Model
              </label>
              <InputSelect
                id="driving-class-vehicle-model"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                options={vehicleOptions}
                placeholder="e.g., Maruti Swift / Honda Activa"
              />
            </div>
          </div>

          {/* Action Buttons: Cancel and Save Record */}
          <div className="pt-4 border-t border-[#E2E8F0] flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-xs font-bold text-[#0E113C] bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] rounded-xl transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 text-xs font-bold text-[#0E113C] bg-[#FBA920] hover:bg-[#E0910E] rounded-xl transition-all flex items-center gap-1.5 shadow-md shadow-[#FBA920]/25 cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
            >
              <Check className="w-4 h-4 text-[#0E113C]" strokeWidth={2.8} />
              <span>Save Record</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
