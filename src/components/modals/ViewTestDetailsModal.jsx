import React from 'react';
import { Link } from 'react-router-dom';
import { X, Award, CheckCircle2, XCircle, Clock, Calendar, RefreshCw, ChevronRight } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function ViewTestDetailsModal({ isOpen, onClose, test, onUpdateResult, onScheduleRetest }) {
  const { licenceTests, students } = useApp();

  if (!isOpen || !test) return null;

  const student = students.find((s) => s.id === test.studentId);

  // Get all attempts for this student & track
  const relatedAttempts = licenceTests
    .filter(
      (t) =>
        t.studentId === test.studentId &&
        t.testType === test.testType &&
        (test.testType === 'LL' || t.category === test.category)
    )
    .sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070926]/70 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] my-8 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E2E8F0] flex items-center justify-between bg-white rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <Award className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Licence Test & Retest Journey
              </h3>
              <p className="text-xs text-[#5A627A]">
                Complete attempt history and progression
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

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Student Header */}
          <div className="flex items-center justify-between p-4 bg-[#F6F8FB] rounded-xl border border-[#E2E8F0]">
            <div className="flex items-center gap-3.5">
              <img
                src={student?.photo || test.photo}
                alt={test.studentName}
                className="w-12 h-12 rounded-full object-cover border border-[#E2E8F0]"
              />
              <div>
                <Link
                  to={`/students/${test.studentId}`}
                  className="font-extrabold text-[#0E113C] text-sm hover:text-[#FBA920] hover:underline transition-colors block"
                  title="View full student profile"
                >
                  {test.studentName}
                </Link>
                <div className="text-xs text-[#5A627A] flex items-center gap-2 mt-0.5">
                  <span className="font-mono">{test.studentId}</span>
                  <span>•</span>
                  <span className="font-semibold text-[#0E113C]">
                    {test.testType === 'LL' ? "Learner's Licence (LL)" : `Driving Licence (DL) – ${test.category}`}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] text-[#5A627A] block">Total Attempts</span>
              <span className="text-lg font-black text-[#0E113C]">{relatedAttempts.length}</span>
            </div>
          </div>

          {/* Chronological Timeline */}
          <div>
            <h4 className="text-xs font-bold text-[#0E113C] uppercase tracking-wider mb-3">
              Chronological Attempt History
            </h4>
            <div className="space-y-3">
              {relatedAttempts.map((att, idx) => {
                const isPassed = att.result === 'Passed';
                const isFailed = att.result === 'Failed';
                const isPending = att.result === 'Pending';

                return (
                  <div
                    key={att.id}
                    className={`p-4 rounded-xl border transition-all ${
                      att.id === test.id
                        ? 'border-[#0E113C] bg-white ring-1 ring-black/10'
                        : 'border-[#E2E8F0] bg-white hover:bg-[#F6F8FB]'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shrink-0 ${
                            isPassed
                              ? 'bg-emerald-100 text-emerald-800'
                              : isFailed
                              ? 'bg-red-100 text-red-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {att.attemptNumber || idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-[#0E113C]">
                              {att.attemptType} Attempt #{att.attemptNumber || idx + 1}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                                isPassed
                                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                  : isFailed
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : 'bg-amber-50 text-amber-700 border-amber-200'
                              }`}
                            >
                              {att.result}
                            </span>
                          </div>
                          <span className="text-[11px] text-[#5A627A] font-mono">
                            Scheduled Date: {att.testDate}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {att.result !== 'Passed' && onUpdateResult && (
                          <button
                            type="button"
                            onClick={() => {
                              onClose();
                              onUpdateResult(att);
                            }}
                            className="px-2.5 py-1 text-[11px] font-bold bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] rounded-lg transition-colors cursor-pointer"
                          >
                            Update
                          </button>
                        )}
                      </div>
                    </div>

                    {att.remarks && (
                      <div className="mt-2 text-xs text-[#5A627A] pl-9 border-t border-dashed border-[#E2E8F0] pt-1.5">
                        Remarks: {att.remarks}
                      </div>
                    )}

                    {att.retestDate && (
                      <div className="mt-1 text-[11px] text-[#0E113C] font-semibold pl-9">
                        Next Retest Scheduled: <span className="font-mono text-black">{att.retestDate}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#F6F8FB] border-t border-[#E2E8F0] rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white border border-[#E2E8F0] text-xs font-bold text-[#0E113C] hover:bg-[#EEF0F8] rounded-xl cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
