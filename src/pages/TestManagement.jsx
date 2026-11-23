import React, { useState, useMemo } from 'react';
import {
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  Search,
  RefreshCw,
  Trash2,
  ChevronLeft,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import CustomSelect from '../components/common/CustomSelect';
import ScheduleTestModal from '../components/modals/ScheduleTestModal';
import UpdateTestResultModal from '../components/modals/UpdateTestResultModal';
import ViewTestDetailsModal from '../components/modals/ViewTestDetailsModal';

export default function TestManagement() {
  const { licenceTests, stats, deleteTestRecord, isScheduleTestOpen, setIsScheduleTestOpen } = useApp();

  // Modals state
  const [updatingTest, setUpdatingTest] = useState(null);
  const [viewingTest, setViewingTest] = useState(null);

  // Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [testTypeFilter, setTestTypeFilter] = useState('All'); // All, LL, DL
  const [categoryFilter, setCategoryFilter] = useState('All'); // All, LMV, M/C
  const [statusFilter, setStatusFilter] = useState('All'); // All, Upcoming, Today, Pending, Passed, Failed, Overdue
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper to determine status category
  const getStatusCategory = (test) => {
    if (test.result === 'Passed') return 'Passed';
    if (test.result === 'Failed') return 'Failed';
    // When Pending:
    if (test.testDate === todayStr) return 'Today';
    if (test.testDate > todayStr) return 'Upcoming';
    if (test.testDate < todayStr) return 'Overdue';
    return 'Pending';
  };

  // Helper for test status styling and label
  const getTestStatusInfo = (test) => {
    if (test.result === 'Passed') {
      return { label: 'Passed', color: 'bg-emerald-50 text-emerald-800 border-emerald-200', icon: CheckCircle2 };
    }
    if (test.result === 'Failed') {
      return { label: 'Failed', color: 'bg-red-50 text-red-800 border-red-200', icon: XCircle };
    }
    // Pending
    if (test.testDate === todayStr) {
      return { label: 'Today', color: 'bg-amber-100 text-amber-900 border-amber-300 font-extrabold', icon: Clock };
    }
    if (test.testDate > todayStr) {
      return { label: 'Upcoming', color: 'bg-blue-50 text-blue-800 border-blue-200', icon: null };
    }
    return {
      label: 'Pending (Overdue)',
      isOverdue: true,
      color: 'bg-amber-50 text-amber-900 border-amber-300',
      icon: AlertCircle
    };
  };

  // Filtered Tests
  const filteredTests = useMemo(() => {
    return licenceTests.filter((test) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        test.studentName.toLowerCase().includes(q) ||
        test.studentId.toLowerCase().includes(q) ||
        (test.category && test.category.toLowerCase().includes(q)) ||
        (test.remarks && test.remarks.toLowerCase().includes(q));

      const matchesType = testTypeFilter === 'All' || test.testType === testTypeFilter;

      let matchesCat = true;
      if (categoryFilter !== 'All' && test.testType !== 'LL') {
        if (categoryFilter === 'LMV + M/C') {
          matchesCat = test.category === 'LMV + M/C' || (test.category?.includes('LMV') && test.category?.includes('M/C'));
        } else if (categoryFilter === 'LMV') {
          matchesCat = test.category === 'LMV' || test.category?.includes('LMV');
        } else if (categoryFilter === 'M/C') {
          matchesCat = test.category === 'M/C' || test.category?.includes('M/C');
        } else {
          matchesCat = test.category === categoryFilter;
        }
      }

      const currentStatus = getStatusCategory(test);
      let matchesStatus = true;
      if (statusFilter === 'Upcoming') {
        matchesStatus = test.result === 'Pending' && test.testDate > todayStr;
      } else if (statusFilter === 'Retests') {
        matchesStatus = test.result === 'Pending' && test.attemptType === 'Retest';
      } else if (statusFilter === 'Today') {
        matchesStatus = test.result === 'Pending' && test.testDate === todayStr;
      } else if (statusFilter === 'Pending') {
        matchesStatus = test.result === 'Pending';
      } else if (statusFilter === 'Passed') {
        matchesStatus = test.result === 'Passed';
      } else if (statusFilter === 'Failed') {
        matchesStatus = test.result === 'Failed';
      } else if (statusFilter === 'Overdue') {
        matchesStatus = test.result === 'Pending' && test.testDate < todayStr;
      }

      return matchesSearch && matchesType && matchesCat && matchesStatus;
    });
  }, [licenceTests, searchQuery, testTypeFilter, categoryFilter, statusFilter, todayStr]);

  // Pagination
  const totalPages = Math.ceil(filteredTests.length / pageSize) || 1;
  const paginatedTests = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredTests.slice(start, start + pageSize);
  }, [filteredTests, currentPage, pageSize]);

  const handleDelete = (test) => {
    if (window.confirm(`Are you sure you want to delete this test attempt for ${test.studentName}?`)) {
      deleteTestRecord(test.id);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in w-full min-w-0">
      {/* 5 Summary KPI Cards as specified in Section 9 */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Upcoming Tests */}
        <div
          onClick={() => {
            setStatusFilter('Upcoming');
            setCurrentPage(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Upcoming'
              ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
              : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:border-black/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Upcoming' ? 'text-gray-300' : 'text-[#5A627A]'}`}>
              Upcoming Tests
            </span>
            <Calendar className={`w-4 h-4 ${statusFilter === 'Upcoming' ? 'text-[#FBA920]' : 'text-[#0E113C]'}`} />
          </div>
          <p className="text-2xl font-black mt-1.5">{stats.upcomingTestsCount}</p>
          <span className={`text-[10px] ${statusFilter === 'Upcoming' ? 'text-gray-400' : 'text-[#94A3B8]'}`}>
            Original attempts scheduled
          </span>
        </div>

        {/* Card 2: Upcoming Retests */}
        <div
          onClick={() => {
            setStatusFilter('Retests');
            setCurrentPage(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Retests'
              ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
              : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:border-black/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Retests' ? 'text-gray-300' : 'text-[#5A627A]'}`}>
              Upcoming Retests
            </span>
            <RefreshCw className={`w-4 h-4 ${statusFilter === 'Retests' ? 'text-[#FBA920]' : 'text-[#E0910E]'}`} />
          </div>
          <p className="text-2xl font-black mt-1.5">{stats.upcomingRetestsCount}</p>
          <span className={`text-[10px] ${statusFilter === 'Retests' ? 'text-gray-400' : 'text-[#94A3B8]'}`}>
            Retests scheduled
          </span>
        </div>

        {/* Card 3: Pending Results */}
        <div
          onClick={() => {
            setStatusFilter('Pending');
            setCurrentPage(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Pending'
              ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
              : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:border-black/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Pending' ? 'text-gray-300' : 'text-[#5A627A]'}`}>
              Pending Results
            </span>
            <Clock className={`w-4 h-4 ${statusFilter === 'Pending' ? 'text-[#FBA920]' : 'text-amber-500'}`} />
          </div>
          <p className="text-2xl font-black mt-1.5">{stats.pendingResultsCount}</p>
          <span className={`text-[10px] ${statusFilter === 'Pending' ? 'text-gray-400' : 'text-[#94A3B8]'}`}>
            Awaiting portal confirmation
          </span>
        </div>

        {/* Card 4: Total Passed */}
        <div
          onClick={() => {
            setStatusFilter('Passed');
            setCurrentPage(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Passed'
              ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
              : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:border-black/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Passed' ? 'text-gray-300' : 'text-[#5A627A]'}`}>
              Total Passed
            </span>
            <CheckCircle2 className={`w-4 h-4 ${statusFilter === 'Passed' ? 'text-[#FBA920]' : 'text-emerald-600'}`} />
          </div>
          <p className="text-2xl font-black mt-1.5">{stats.totalTestsPassed}</p>
          <span className={`text-[10px] ${statusFilter === 'Passed' ? 'text-gray-400' : 'text-[#94A3B8]'}`}>
            Licence granted attempts
          </span>
        </div>

        {/* Card 5: Total Failed */}
        <div
          onClick={() => {
            setStatusFilter('Failed');
            setCurrentPage(1);
          }}
          className={`p-4 rounded-2xl border transition-all cursor-pointer ${
            statusFilter === 'Failed'
              ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
              : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:border-black/30'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${statusFilter === 'Failed' ? 'text-gray-300' : 'text-[#5A627A]'}`}>
              Total Failed
            </span>
            <XCircle className={`w-4 h-4 ${statusFilter === 'Failed' ? 'text-[#FBA920]' : 'text-red-500'}`} />
          </div>
          <p className="text-2xl font-black mt-1.5">{stats.totalTestsFailed}</p>
          <span className={`text-[10px] ${statusFilter === 'Failed' ? 'text-gray-400' : 'text-[#94A3B8]'}`}>
            Retest eligible
          </span>
        </div>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card space-y-3.5">
        <div className="flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search student by name, student ID, or remarks..."
              className="w-full bg-[#F6F8FB] focus:bg-white text-sm text-[#0E113C] pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 transition-all placeholder:text-[#94A3B8]"
            />
          </div>

        </div>

        {/* Secondary Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#E2E8F0]/70 text-xs">
          {/* Test Type Filter */}
          <CustomSelect
            prefix="Type:"
            value={testTypeFilter}
            onChange={(e) => {
              setTestTypeFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'All', label: 'All Types (LL & DL)' },
              { value: 'LL', label: "Learner's Licence (LL)" },
              { value: 'DL', label: "Driving Licence (DL)" }
            ]}
            size="sm"
            className="bg-[#F6F8FB]"
          />

          {/* Category Filter */}
          <CustomSelect
            prefix="Category:"
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'All', label: 'All Categories' },
              { value: 'LMV', label: 'LMV (Car)' },
              { value: 'M/C', label: 'M/C (Motorcycle)' },
              { value: 'LMV + M/C', label: 'LMV + M/C (Both)' }
            ]}
            size="sm"
            className="bg-[#F6F8FB]"
          />

          {/* Status Filter */}
          <CustomSelect
            prefix="Status:"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'All', label: 'All Statuses' },
              { value: 'Upcoming', label: 'Upcoming' },
              { value: 'Retests', label: 'Upcoming Retests' },
              { value: 'Today', label: 'Today' },
              { value: 'Overdue', label: 'Overdue Pending' },
              { value: 'Pending', label: 'Pending Result' },
              { value: 'Passed', label: 'Passed' },
              { value: 'Failed', label: 'Failed' }
            ]}
            size="sm"
            className="bg-[#F6F8FB]"
          />
        </div>
      </div>

      {/* Test Records Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-dd-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full table-auto text-left text-xs sm:text-sm">
            <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="w-[20%] py-3.5 px-4 sm:px-5 whitespace-nowrap">Student Name</th>
                <th className="w-[13%] py-3.5 px-4 sm:px-5 whitespace-nowrap">Test Type</th>
                <th className="w-[13%] py-3.5 px-4 sm:px-5 whitespace-nowrap">Category</th>
                <th className="w-[14%] py-3.5 px-4 sm:px-5 whitespace-nowrap">Original / Retest</th>
                <th className="w-[13%] py-3.5 px-4 sm:px-5 whitespace-nowrap">Test Date</th>
                <th className="w-[15%] py-3.5 px-4 sm:px-5 whitespace-nowrap">Current Status</th>
                <th className="w-[12%] py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {paginatedTests.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-[#94A3B8]">
                    No test records found matching the specified filters.
                  </td>
                </tr>
              ) : (
                paginatedTests.map((t) => {
                  const statusInfo = getTestStatusInfo(t);
                  const StatusIcon = statusInfo.icon;

                  return (
                    <tr key={t.id} className="hover:bg-[#F6F8FB] transition-colors">
                      {/* Student Name */}
                      <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => setViewingTest(t)}
                          className="text-left group cursor-pointer hover:underline hover:text-[#FBA920] transition-colors"
                          title="Click to view student details"
                        >
                          <div className="font-bold text-[#0E113C] group-hover:text-[#FBA920] group-hover:underline transition-colors cursor-pointer">
                            {t.studentName}
                          </div>
                          <div className="text-[11px] text-[#5A627A] font-mono group-hover:text-[#FBA920] group-hover:underline transition-colors cursor-pointer">
                            {t.studentId}
                          </div>
                        </button>
                      </td>

                      {/* Test Type */}
                      <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                        <span className="font-extrabold text-xs text-[#0E113C] px-2.5 py-1 bg-[#EEF0F8] rounded-lg">
                          {t.testType === 'LL' ? "LL (Learner)" : "DL (Driving)"}
                        </span>
                      </td>

                      {/* Vehicle Category */}
                      <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                        {t.testType === 'LL' ? (
                          <span className="font-semibold text-[#5A627A]">LMV / All</span>
                        ) : (t.category === 'LMV + M/C' || (t.category?.includes('LMV') && t.category?.includes('M/C'))) ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-black bg-[#0E113C] text-white tracking-wide shadow-xs">
                            <span>LMV</span>
                            <span className="text-[#FBA920]">+</span>
                            <span>M/C</span>
                          </span>
                        ) : (
                          <span className="font-semibold text-[#0E113C]">
                            {t.category || 'LMV'}
                          </span>
                        )}
                      </td>

                      {/* Original / Retest */}
                      <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                              t.attemptType === 'Retest'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-gray-100 text-gray-800 border-gray-300'
                            }`}
                          >
                            {t.attemptType} #{t.attemptNumber || 1}
                          </span>
                        </div>
                      </td>

                      {/* Test Date */}
                      <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap font-mono text-xs font-bold text-[#0E113C]">
                        {t.testDate}
                      </td>

                      {/* Current Status */}
                      <td className="py-3.5 px-4 sm:px-5 whitespace-nowrap">
                        {statusInfo.isOverdue ? (
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border ${statusInfo.color}`}
                          >
                            {StatusIcon && (
                              <StatusIcon className="w-4 h-4 shrink-0 text-amber-600" />
                            )}
                            <span className="flex flex-col text-left leading-tight">
                              <span className="text-[11px] font-bold leading-tight">Pending</span>
                              <span className="text-[10px] font-bold leading-tight text-amber-700">Overdue</span>
                            </span>
                          </span>
                        ) : (
                          <span
                            className={`inline-flex items-center ${StatusIcon ? 'gap-1.5' : ''} px-2.5 py-1 rounded-full text-xs font-bold border ${statusInfo.color}`}
                          >
                            {StatusIcon && <StatusIcon className="w-3.5 h-3.5 shrink-0" />}
                            <span>{statusInfo.label}</span>
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 sm:px-5 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-2">
                          {/* Update Result slot: fixed width so delete icon never shifts */}
                          {t.result !== 'Passed' ? (
                            <button
                              type="button"
                              onClick={() => setUpdatingTest(t)}
                              className="w-16 py-1 text-center rounded-lg text-xs font-bold bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] transition-colors cursor-pointer shrink-0"
                              title="Update Result / Record Outcome"
                            >
                              Update
                            </button>
                          ) : (
                            <div className="w-16 shrink-0" aria-hidden="true" />
                          )}

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => handleDelete(t)}
                            className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="px-6 py-4 bg-[#F6F8FB] border-t border-[#E2E8F0] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A627A]">
          <div>
            Showing <span className="font-bold text-[#0E113C]">{filteredTests.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}</span> to{' '}
            <span className="font-bold text-[#0E113C]">{Math.min(currentPage * pageSize, filteredTests.length)}</span> of{' '}
            <span className="font-bold text-[#0E113C]">{filteredTests.length}</span> tests
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-3 font-semibold text-[#0E113C]">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-[#E2E8F0] bg-white text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <ScheduleTestModal
        isOpen={isScheduleTestOpen}
        onClose={() => setIsScheduleTestOpen(false)}
      />

      <UpdateTestResultModal
        isOpen={!!updatingTest}
        onClose={() => setUpdatingTest(null)}
        test={updatingTest}
      />

      <ViewTestDetailsModal
        isOpen={!!viewingTest}
        onClose={() => setViewingTest(null)}
        test={viewingTest}
        onUpdateResult={(t) => setUpdatingTest(t)}
      />
    </div>
  );
}
