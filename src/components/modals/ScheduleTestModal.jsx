import React, { useState, useEffect } from 'react';
import { X, Calendar, Award, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import CustomSelect from '../common/CustomSelect';

export default function ScheduleTestModal({ isOpen, onClose, preselectedStudentId, defaultTestType, defaultCategory }) {
  const { students, addTestRecord, licenceTests } = useApp();

  const parseCategories = (cat) => {
    if (!cat) return ['LMV'];
    if (Array.isArray(cat)) {
      const valid = cat.filter((c) => c === 'LMV' || c === 'M/C');
      return valid.length > 0 ? valid : ['LMV'];
    }
    const str = String(cat);
    if (str.includes('+') || (str.includes('LMV') && str.includes('M/C'))) {
      return ['LMV', 'M/C'];
    }
    if (str.includes('M/C')) return ['M/C'];
    return ['LMV'];
  };

  const [studentId, setStudentId] = useState(preselectedStudentId || (students[0]?.id || ''));
  const [testType, setTestType] = useState(defaultTestType || 'LL');
  const [selectedCategories, setSelectedCategories] = useState(() => parseCategories(defaultCategory));
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [attemptType, setAttemptType] = useState('Original');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (preselectedStudentId) {
        setStudentId(preselectedStudentId);
      } else if (!studentId && students.length > 0) {
        setStudentId(students[0]?.id || '');
      }
      if (defaultTestType) {
        setTestType(defaultTestType);
      }
      if (defaultCategory) {
        setSelectedCategories(parseCategories(defaultCategory));
      }
      setError('');
    }
  }, [preselectedStudentId, defaultTestType, defaultCategory, isOpen]);

  if (!isOpen) return null;

  const selectedStudent = students.find((s) => s.id === studentId) || students[0];

  const handleToggleCategory = (catVal) => {
    setError('');
    setSelectedCategories((prev) => {
      if (prev.includes(catVal)) {
        if (prev.length === 1) {
          setError('At least one vehicle category must be selected.');
          return prev;
        }
        return prev.filter((c) => c !== catVal);
      } else {
        const next = [...prev, catVal];
        return ['LMV', 'M/C'].filter((c) => next.includes(c));
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!studentId || !selectedStudent) {
      setError('Please select a student.');
      return;
    }
    if (testType === 'DL' && selectedCategories.length === 0) {
      setError('Please select at least one vehicle category.');
      return;
    }
    if (!testDate) {
      setError('Please choose a valid test date.');
      return;
    }

    let finalCategory = 'LMV';
    if (testType === 'DL') {
      if (selectedCategories.includes('LMV') && selectedCategories.includes('M/C')) {
        finalCategory = 'LMV + M/C';
      } else if (selectedCategories.includes('M/C')) {
        finalCategory = 'M/C';
      } else {
        finalCategory = 'LMV';
      }
    }

    addTestRecord({
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      testType,
      category: testType === 'LL' ? 'LMV' : finalCategory,
      attemptType,
      testDate,
      result: 'Pending',
      retestDate: null,
      retestStatus: 'None',
      remarks: remarks.trim() || `${testType}${testType === 'DL' ? ` (${finalCategory})` : ''} Test scheduled`
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
              <Calendar className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Schedule Licence Test / Retest
              </h3>
              <p className="text-xs text-[#5A627A]">
                Schedule official Learner's Licence (LL) or Driving Licence (DL) test
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Student selection */}
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
              className="py-2.5"
            />
          </div>

          {/* Test Type */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
              Test Type *
            </label>
            <div className="grid grid-cols-2 gap-3">
              {[
                { val: 'LL', label: "Learner's Licence (LL)", desc: 'Theory & Computer Test' },
                { val: 'DL', label: "Driving Licence (DL)", desc: 'Practical Ground & Road Test' }
              ].map((t) => (
                <button
                  type="button"
                  key={t.val}
                  onClick={() => setTestType(t.val)}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    testType === t.val
                      ? 'border-[#0E113C] bg-[#0E113C] text-white shadow-sm'
                      : 'border-[#E2E8F0] bg-[#F6F8FB] text-[#0E113C] hover:bg-[#EEF0F8]'
                  }`}
                >
                  <div className="font-extrabold text-xs">{t.label}</div>
                  <div className={`text-[10px] ${testType === t.val ? 'text-gray-300' : 'text-[#5A627A]'}`}>
                    {t.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* If DL, Vehicle Category */}
          {testType === 'DL' && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold text-[#0E113C]">
                  Vehicle Category *
                </label>
                <span className="text-[10px] text-[#5A627A]">
                  Select LMV, M/C, or both
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { val: 'LMV', label: 'LMV – Light Motor Vehicle', desc: 'Car / 4-Wheeler' },
                  { val: 'M/C', label: 'M/C – Motorcycle', desc: 'Two-Wheeler / 8-Track' }
                ].map((c) => {
                  const isSelected = selectedCategories.includes(c.val);
                  return (
                    <button
                      type="button"
                      key={c.val}
                      onClick={() => handleToggleCategory(c.val)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer relative ${
                        isSelected
                          ? 'border-[#0E113C] bg-[#0E113C] text-white shadow-sm ring-1 ring-[#0E113C]'
                          : 'border-[#E2E8F0] bg-white text-[#0E113C] hover:bg-[#F6F8FB]'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <div className={`font-extrabold text-xs ${isSelected ? 'text-white' : 'text-[#0E113C]'}`}>
                          {c.label}
                        </div>
                        <div
                          className={`w-4 h-4 rounded-md flex items-center justify-center shrink-0 border transition-colors ${
                            isSelected
                              ? 'bg-[#FBA920] border-[#FBA920] text-[#0E113C]'
                              : 'bg-white border-[#CBD5E1] text-transparent'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      </div>
                      <div className={`text-[10px] ${isSelected ? 'text-gray-300' : 'text-[#5A627A]'}`}>
                        {c.desc}
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedCategories.length === 2 && (
                <div className="mt-2 p-2 bg-[#EEF0F8] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
                  <span className="text-[#5A627A] text-[11px] font-medium">Both categories selected:</span>
                  <span className="font-extrabold text-white bg-[#0E113C] px-2 py-0.5 rounded-md text-[11px] tracking-wide">
                    LMV + M/C
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Test Date & Attempt Type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Test Date *
              </label>
              <input
                type="date"
                value={testDate}
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1">
                Attempt Type
              </label>
              <CustomSelect
                value={attemptType}
                onChange={(e) => setAttemptType(e.target.value)}
                options={[
                  { value: 'Original', label: 'Original Attempt' },
                  { value: 'Retest', label: 'Retest Attempt' }
                ]}
                className="py-2"
              />
            </div>
          </div>

          {/* Remarks */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Test Schedule Remarks
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Slot booked at RTO testing ground; carry original Form 2"
              className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
            />
          </div>

          {/* Footer buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#E2E8F0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-[#5A627A] hover:text-[#0E113C] rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-[#0E113C] hover:bg-[#181C54] text-white text-xs font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
