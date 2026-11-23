import React, { useState, useEffect } from 'react';
import { X, Award, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function UpdateTestResultModal({ isOpen, onClose, test }) {
  const { updateTestRecord, scheduleRetest } = useApp();

  const [result, setResult] = useState('Pending');
  const [remarks, setRemarks] = useState('');
  const [retestDate, setRetestDate] = useState('');
  const [retestRemarks, setRetestRemarks] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (test) {
      setResult(test.result || 'Pending');
      setRemarks(test.remarks || '');
      setRetestDate(test.retestDate || '');
      setRetestRemarks('');
      setError('');
    }
  }, [test, isOpen]);

  if (!isOpen || !test) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (result === 'Failed') {
      if (retestDate) {
        scheduleRetest(test.id, {
          retestDate,
          remarks: retestRemarks.trim() || remarks.trim()
        });
      } else {
        updateTestRecord(test.id, {
          result: 'Failed',
          remarks: remarks.trim(),
          retestDate: null,
          retestStatus: 'None'
        });
      }
      onClose();
      return;
    }

    if (result === 'Passed') {
      updateTestRecord(test.id, {
        result: 'Passed',
        remarks: remarks.trim(),
        retestDate: null,
        retestStatus: 'None'
      });
      onClose();
      return;
    }

    // Pending
    updateTestRecord(test.id, {
      result: 'Pending',
      remarks: remarks.trim(),
      retestDate: null,
      retestStatus: 'None'
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
              <Award className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Update Test Result & Outcome
              </h3>
              <p className="text-xs text-[#5A627A]">
                Record official test outcome and manage retest schedules
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
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Test Overview Card */}
          <div className="p-3.5 bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] text-xs space-y-1.5">
            <div className="flex justify-between items-center">
              <span className="text-[#5A627A]">Student:</span>
              <span className="font-extrabold text-[#0E113C]">{test.studentName} ({test.studentId})</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5A627A]">Test Type & Category:</span>
              <span className="font-bold text-[#0E113C]">
                {test.testType === 'LL' ? "Learner's Licence (LL)" : `Driving Licence (${test.category || 'LMV'})`}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5A627A]">Attempt:</span>
              <span className="font-mono font-semibold text-[#0E113C]">
                {test.attemptType} #{test.attemptNumber || 1}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[#5A627A]">Test Date:</span>
              <span className="font-mono font-bold text-[#0E113C]">{test.testDate}</span>
            </div>
          </div>

          {/* Result Selection */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-2">
              Official Test Result *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { val: 'Pending', label: 'Pending Result', icon: Clock, color: 'border-amber-400 bg-amber-50 text-amber-800' },
                { val: 'Passed', label: 'Passed', icon: CheckCircle2, color: 'border-emerald-500 bg-emerald-50 text-emerald-800' },
                { val: 'Failed', label: 'Failed', icon: XCircle, color: 'border-red-500 bg-red-50 text-red-800' }
              ].map((opt) => {
                const Icon = opt.icon;
                const isSelected = result === opt.val;
                return (
                  <button
                    type="button"
                    key={opt.val}
                    onClick={() => setResult(opt.val)}
                    className={`p-3 rounded-xl border-2 font-bold text-xs flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? `${opt.color} shadow-sm font-extrabold ring-1 ring-black/10`
                        : 'border-[#E2E8F0] bg-white text-[#5A627A] hover:bg-[#EEF0F8]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Test Remarks */}
          <div>
            <label className="block text-xs font-bold text-[#0E113C] mb-1">
              Remarks / Examiner Feedback
            </label>
            <input
              type="text"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. Ground 'H' track passed smoothly; or theory score 18/20"
              className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
            />
          </div>

          {/* If Result is Failed, display Retest scheduling section directly */}
          {result === 'Failed' && (
            <div className="p-4 bg-red-50/70 border border-red-200 rounded-xl space-y-3">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span className="text-xs font-bold text-red-900">
                  Retest Scheduling & Date
                </span>
              </div>

              <p className="text-[11px] text-red-700 leading-relaxed">
                Enter the scheduled retest date below. Saving will update the <strong>Test Date</strong> directly, set the status to <strong>Pending</strong>, and update the attempt to <strong>Retest #{test.attemptType === 'Retest' ? (test.attemptNumber || 1) + 1 : 1}</strong>.
              </p>

              <div className="space-y-2.5 pt-1">
                <div>
                  <label className="block text-[11px] font-bold text-red-900 mb-1">
                    Scheduled Retest Date
                  </label>
                  <input
                    type="date"
                    value={retestDate}
                    onChange={(e) => setRetestDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-red-300 text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-red-900 mb-1">
                    Retest Preparation / Examiner Remarks
                  </label>
                  <input
                    type="text"
                    value={retestRemarks}
                    onChange={(e) => setRetestRemarks(e.target.value)}
                    placeholder="e.g. Schedule 2 extra sessions on hill restart before retest"
                    className="w-full px-3 py-2 text-xs bg-white rounded-xl border border-red-300 text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer actions */}
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
              Save Test Result
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
