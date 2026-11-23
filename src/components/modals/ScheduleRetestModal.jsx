import React, { useState, useEffect } from 'react';
import { X, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ScheduleRetestModal({ isOpen, onClose, parentTest }) {
  const { scheduleRetest } = useApp();

  const [retestDate, setRetestDate] = useState('');
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (parentTest) {
      setRetestDate('');
      setRemarks('');
      setError('');
    }
  }, [parentTest, isOpen]);

  if (!isOpen || !parentTest) return null;

  const nextAttemptNumber = (parentTest.attemptNumber || 1) + 1;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!retestDate) {
      setError('Please select a valid Retest Date.');
      return;
    }

    scheduleRetest(parentTest.id, {
      retestDate,
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
              <RefreshCw className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Schedule Licence Retest (Attempt #{nextAttemptNumber})
              </h3>
              <p className="text-xs text-[#5A627A]">
                Schedule subsequent retest without overwriting previous attempts
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

          {/* Previous Attempt Summary Box */}
          <div className="p-3.5 bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#5A627A]">Student:</span>
              <span className="font-extrabold text-[#0E113C]">{parentTest.studentName} ({parentTest.studentId})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5A627A]">Test Category:</span>
              <span className="font-bold text-[#0E113C]">
                {parentTest.testType === 'LL' ? "Learner's Licence (LL)" : `Driving Licence (${parentTest.category || 'LMV'})`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5A627A]">Previous Attempt:</span>
              <span className="font-mono font-bold text-red-600">
                Attempt #{parentTest.attemptNumber || 1} on {parentTest.testDate} (Failed)
              </span>
            </div>
            {parentTest.remarks && (
              <div className="pt-1 text-[11px] text-[#5A627A] italic">
                Reason: {parentTest.remarks}
              </div>
            )}
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Retest History Rule:</strong> Attempt #{parentTest.attemptNumber || 1} will remain marked as Failed in the student's chronological history.
              A new retest attempt (Attempt #{nextAttemptNumber}) will be registered for the selected date.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              New Retest Date *
            </label>
            <input
              type="date"
              value={retestDate}
              onChange={(e) => setRetestDate(e.target.value)}
              className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-semibold"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Retest Remarks / Training Focus
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Schedule 2 mock 'H' track practice sessions before retest"
              className="w-full px-3.5 py-2 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
            />
          </div>

          {/* Footer */}
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
              Schedule Retest #{nextAttemptNumber}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
