import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  UserCheck,
  IndianRupee,
  GraduationCap,
  Plus,
  Search,
  Eye,
  ArrowUpRight,
  Award,
  Calendar,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  AlertCircle,
  Trash2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddDrivingClassModal from '../components/modals/AddDrivingClassModal';
import UpdateTestResultModal from '../components/modals/UpdateTestResultModal';
import ScheduleRetestModal from '../components/modals/ScheduleRetestModal';
import ViewTestDetailsModal from '../components/modals/ViewTestDetailsModal';

export default function Dashboard() {
  const { stats, students, drivingRecords, licenceTests, deleteTestRecord } = useApp();
  const [dashboardSearch, setDashboardSearch] = useState('');
  const [isAddDrivingClassOpen, setIsAddDrivingClassOpen] = useState(false);
  const [activeSectionTab, setActiveSectionTab] = useState('today-driving'); // 'today-driving' | 'upcoming-tests' | 'recent-students'
  const [testSubTab, setTestSubTab] = useState('upcoming'); // 'upcoming' | 'overdue' | 'all'
  const [updatingTest, setUpdatingTest] = useState(null);
  const [retestingTest, setRetestingTest] = useState(null);
  const [viewingTest, setViewingTest] = useState(null);

  const handleDeleteTest = (test) => {
    if (window.confirm(`Are you sure you want to delete this test attempt for ${test.studentName}?`)) {
      deleteTestRecord(test.id);
    }
  };

  const todayStr = new Date().toISOString().split('T')[0];

  // Helper for test status
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

  // Filtered upcoming and recent tests for Dashboard
  const displayTests = useMemo(() => {
    const q = dashboardSearch.toLowerCase().trim();
    let list = licenceTests;

    if (testSubTab === 'upcoming') {
      list = list.filter((t) => t.result === 'Pending' && t.testDate >= todayStr);
    } else if (testSubTab === 'overdue') {
      list = list.filter((t) => t.result === 'Pending' && t.testDate < todayStr);
    }

    if (q) {
      list = list.filter(
        (t) =>
          t.studentName.toLowerCase().includes(q) ||
          t.studentId.toLowerCase().includes(q) ||
          t.testType.toLowerCase().includes(q) ||
          (t.category && t.category.toLowerCase().includes(q))
      );
    }

    // Sort by testDate ascending for upcoming, descending for all
    return [...list].sort((a, b) => {
      if (testSubTab === 'upcoming') return a.testDate.localeCompare(b.testDate);
      return b.testDate.localeCompare(a.testDate);
    }).slice(0, 10);
  }, [licenceTests, testSubTab, dashboardSearch, todayStr]);

  // Filter recently registered students
  const displayStudents = useMemo(() => {
    const q = dashboardSearch.toLowerCase().trim();
    if (!q) return students.slice(0, 6);
    return students
      .filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q) ||
          (s.phone1 && s.phone1.includes(q)) ||
          (s.classOfMode && s.classOfMode.toLowerCase().includes(q))
      )
      .slice(0, 10);
  }, [students, dashboardSearch]);

  // Today's driving records
  const displayDrivingRecords = useMemo(() => {
    const q = dashboardSearch.toLowerCase().trim();
    if (!q) return drivingRecords.slice(0, 8);
    return drivingRecords
      .filter(
        (rec) =>
          rec.studentName.toLowerCase().includes(q) ||
          (rec.studentId && rec.studentId.toLowerCase().includes(q)) ||
          (rec.classOfMode && rec.classOfMode.toLowerCase().includes(q))
      )
      .slice(0, 15);
  }, [drivingRecords, dashboardSearch]);

  return (
    <div className="space-y-6 animate-fade-in pb-12 w-full max-w-full overflow-x-hidden min-w-0">
      {/* 4 KPI Statistics Cards */}
      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4 lg:gap-4 w-full min-w-0">
        {/* Card 1: Total Students */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-5 border border-[#E2E8F0] shadow-dd-card flex items-center gap-2 sm:gap-4 hover:shadow-dd-elevated transition-shadow min-w-0 w-full">
          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#EEF0F8] flex items-center justify-center shrink-0">
            <Users className="w-[14px] h-[14px] sm:w-5 sm:h-5 text-[#0E113C]" strokeWidth={2.3} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base sm:text-[22px] xl:text-2xl font-bold sm:font-extrabold text-[#0E113C] tracking-tight truncate leading-tight">
              {stats.totalStudents}
            </div>
            <div className="text-[11px] sm:text-[13px] font-medium text-[#5A627A] mt-0.5 truncate leading-tight">
              Total Students
            </div>
          </div>
        </div>

        {/* Card 2: Active Students */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-5 border border-[#E2E8F0] shadow-dd-card flex items-center gap-2 sm:gap-4 hover:shadow-dd-elevated transition-shadow min-w-0 w-full">
          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#FFF8EB] flex items-center justify-center shrink-0">
            <UserCheck className="w-[14px] h-[14px] sm:w-5 sm:h-5 text-[#E0910E]" strokeWidth={2.3} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base sm:text-[22px] xl:text-2xl font-bold sm:font-extrabold text-[#0E113C] tracking-tight truncate leading-tight">
              {stats.activeStudents}
            </div>
            <div className="text-[11px] sm:text-[13px] font-medium text-[#5A627A] mt-0.5 truncate leading-tight">
              Active Students
            </div>
          </div>
        </div>

        {/* Card 3: Pending Fees */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-5 border border-[#E2E8F0] shadow-dd-card flex items-center gap-2 sm:gap-4 hover:shadow-dd-elevated transition-shadow min-w-0 w-full">
          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#FFF8EB] flex items-center justify-center shrink-0">
            <IndianRupee className="w-[14px] h-[14px] sm:w-5 sm:h-5 text-[#E0910E]" strokeWidth={2.5} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base sm:text-[22px] xl:text-2xl font-bold sm:font-extrabold text-[#0E113C] tracking-tight truncate leading-tight">
              ₹{stats.pendingFees.toLocaleString('en-IN')}
            </div>
            <div className="text-[11px] sm:text-[13px] font-medium text-[#5A627A] mt-0.5 truncate leading-tight">
              Pending Fees
            </div>
          </div>
        </div>

        {/* Card 4: Upcoming Tests & Retests Count */}
        <div className="bg-white rounded-2xl p-2.5 sm:p-5 border border-[#E2E8F0] shadow-dd-card flex items-center gap-2 sm:gap-4 hover:shadow-dd-elevated transition-shadow min-w-0 w-full">
          <div className="w-7 h-7 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-[#EEF0F8] flex items-center justify-center shrink-0">
            <Award className="w-[14px] h-[14px] sm:w-5 sm:h-5 text-[#0E113C]" strokeWidth={2.3} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-base sm:text-[22px] xl:text-2xl font-bold sm:font-extrabold text-[#0E113C] tracking-tight truncate leading-tight">
              {stats.upcomingTestsCount + stats.upcomingRetestsCount + stats.todayTestsCount}
            </div>
            <div className="text-[11px] sm:text-[13px] font-medium text-[#5A627A] mt-0.5 truncate leading-tight">
              Scheduled Tests
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Sections Container */}
      <div className="bg-white rounded-2xl p-3 sm:p-6 border border-[#E2E8F0] shadow-dd-card w-full max-w-full min-w-0">
        {/* Top Control Bar: Search Bar */}
        <div className="pb-4 border-b border-[#E2E8F0]">
          <div className="relative w-full sm:max-w-md">
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={dashboardSearch}
              onChange={(e) => setDashboardSearch(e.target.value)}
              placeholder="Search tests, students, or classes..."
              className="w-full bg-[#F6F8FB] focus:bg-white text-sm text-[#0E113C] pl-10 pr-9 py-2.5 rounded-full border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 placeholder:text-[#94A3B8] transition-all"
            />
            {dashboardSearch && (
              <button
                type="button"
                onClick={() => setDashboardSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#0E113C] cursor-pointer"
                title="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tab Selection Row: 3 tabs */}
        <div className="py-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm min-w-0">
          <button
            type="button"
            onClick={() => setActiveSectionTab('today-driving')}
            className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer min-w-0 ${
              activeSectionTab === 'today-driving'
                ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
                : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:bg-[#EEF0F8]'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                activeSectionTab === 'today-driving' ? 'bg-[#FBA920]' : 'bg-[#0E113C]'
              }`}
            />
            <span className={`font-bold text-xs sm:text-sm truncate ${activeSectionTab === 'today-driving' ? 'text-[#FBA920]' : 'text-[#0E113C]'}`}>
              Today's driving classes
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSectionTab('upcoming-tests')}
            className={`flex items-center justify-between gap-2 p-3.5 rounded-xl border text-left transition-all cursor-pointer min-w-0 ${
              activeSectionTab === 'upcoming-tests'
                ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
                : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:bg-[#EEF0F8]'
            }`}
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                  activeSectionTab === 'upcoming-tests' ? 'bg-[#FBA920]' : 'bg-[#0E113C]'
                }`}
              />
              <span className={`font-bold text-xs sm:text-sm truncate ${activeSectionTab === 'upcoming-tests' ? 'text-[#FBA920]' : 'text-[#0E113C]'}`}>
                Upcoming Tests & Retests
              </span>
            </div>
            {stats.overdueTestsCount > 0 && (
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveSectionTab('upcoming-tests');
                  setTestSubTab('overdue');
                }}
                className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold tracking-tight border transition-colors ${
                  activeSectionTab === 'upcoming-tests'
                    ? 'bg-amber-400/20 text-amber-300 border-amber-400/40 hover:bg-amber-400/30'
                    : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                }`}
                title={`Click to view ${stats.overdueTestsCount} overdue test outcome(s)`}
              >
                Overdue {stats.overdueTestsCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveSectionTab('recent-students')}
            className={`flex items-center gap-2.5 p-3.5 rounded-xl border text-left transition-all cursor-pointer min-w-0 ${
              activeSectionTab === 'recent-students'
                ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
                : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:bg-[#EEF0F8]'
            }`}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                activeSectionTab === 'recent-students' ? 'bg-[#FBA920]' : 'bg-[#0E113C]'
              }`}
            />
            <span className={`font-bold text-xs sm:text-sm truncate ${activeSectionTab === 'recent-students' ? 'text-[#FBA920]' : 'text-[#0E113C]'}`}>
              Recently registered students
            </span>
          </button>
        </div>

        {/* ============================================================== */}
        {/* Tab 1: Today's Driving Classes */}
        {/* ============================================================== */}
        {activeSectionTab === 'today-driving' && (
          <div className="mt-2 pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4 gap-2">
              <h3 className="text-xs font-bold text-[#0E113C] uppercase tracking-wider min-w-0">
                Today's Driving Classes
              </h3>
              <Link
                to="/driving-records"
                className="text-xs font-bold text-[#0E113C] hover:text-[#E0910E] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
              >
                <span className="hidden sm:inline">Open </span>Driving Logbook
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FBA920] shrink-0" />
              </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] min-w-0 w-full max-w-full">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Starting Time</th>
                    <th className="py-3.5 px-4">Ending Time</th>
                    <th className="py-3.5 px-4">KM Travelled</th>
                    <th className="py-3.5 px-4">Class of Rule</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {displayDrivingRecords.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-10 text-center text-xs text-[#94A3B8]">
                        No driving class records found.
                      </td>
                    </tr>
                  ) : (
                    displayDrivingRecords.map((rec) => (
                      <tr key={rec.id} className="hover:bg-[#F6F8FB] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                          <Link
                            to={`/students/${rec.studentId}`}
                            className="hover:text-[#E0910E] hover:underline"
                          >
                            {rec.studentName}
                          </Link>
                        </td>
                        <td className="py-3.5 px-4 text-[#5A627A] font-mono">
                          {rec.startTime}
                        </td>
                        <td className="py-3.5 px-4 text-[#5A627A] font-mono">
                          {rec.endTime}
                        </td>
                        <td className="py-3.5 px-4 font-extrabold text-[#0E113C]">
                          {rec.kmTravelled} KM
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-[#FFF8EB] text-[#0E113C] text-xs font-semibold border border-[#FBA920]/30">
                            {rec.classOfMode || rec.classOfRule}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Circular '+' button */}
            <button
              type="button"
              onClick={() => setIsAddDrivingClassOpen(true)}
              className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#0E113C] hover:bg-[#181C54] text-[#FBA920] flex items-center justify-center shadow-xl shadow-[#0E113C]/40 ring-4 ring-[#0E113C]/20 hover:ring-[#FBA920]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer group"
              title="Add Today's Driving Class"
              aria-label="Add Today's Driving Class"
            >
              <Plus className="w-7 h-7 text-[#FBA920] transition-transform group-hover:rotate-90 duration-200" strokeWidth={3} />
            </button>
          </div>
        )}

        {/* ============================================================== */}
        {/* Tab 2: Upcoming Tests & Retests (Requirement 8) */}
        {/* ============================================================== */}
        {activeSectionTab === 'upcoming-tests' && (
          <div className="mt-2 pt-4 border-t border-[#E2E8F0]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div className="flex items-center gap-3">
                <h3 className="text-xs font-bold text-[#0E113C] uppercase tracking-wider">
                  Upcoming Tests & Retests
                </h3>
                {/* Sub-tabs for quick filtering */}
                <div className="inline-flex rounded-lg border border-[#E2E8F0] p-0.5 bg-[#F6F8FB] text-xs">
                  <button
                    onClick={() => setTestSubTab('upcoming')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      testSubTab === 'upcoming'
                        ? 'bg-[#0E113C] text-white shadow-xs'
                        : 'text-[#5A627A] hover:text-[#0E113C]'
                    }`}
                  >
                    Upcoming & Today ({stats.upcomingTestsCount + stats.upcomingRetestsCount + stats.todayTestsCount})
                  </button>
                  <button
                    onClick={() => setTestSubTab('overdue')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      testSubTab === 'overdue'
                        ? 'bg-[#0E113C] text-white shadow-xs'
                        : 'text-[#5A627A] hover:text-[#0E113C]'
                    }`}
                  >
                    Overdue Results ({stats.overdueTestsCount})
                  </button>
                  <button
                    onClick={() => setTestSubTab('all')}
                    className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
                      testSubTab === 'all'
                        ? 'bg-[#0E113C] text-white shadow-xs'
                        : 'text-[#5A627A] hover:text-[#0E113C]'
                    }`}
                  >
                    All Recent
                  </button>
                </div>
              </div>

              <Link
                to="/tests"
                className="text-xs font-bold text-[#0E113C] hover:text-[#E0910E] hover:underline flex items-center gap-1 shrink-0 whitespace-nowrap"
              >
                <span>Open Test Management</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FBA920] shrink-0" />
              </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] min-w-0 w-full max-w-full">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-3">Test Type</th>
                    <th className="py-3.5 px-3">Vehicle Category</th>
                    <th className="py-3.5 px-3">Test Date</th>
                    <th className="py-3.5 px-3">Attempt Type</th>
                    <th className="py-3.5 px-3">Current Status</th>
                    <th className="py-3.5 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {displayTests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-xs text-[#94A3B8]">
                        No test records matching the active filter.
                      </td>
                    </tr>
                  ) : (
                    displayTests.map((test) => {
                      const statusInfo = getTestStatusInfo(test);
                      const StatusIcon = statusInfo.icon;

                      return (
                        <tr key={test.id} className="hover:bg-[#F6F8FB] transition-colors">
                          {/* Student Name - clickable to open details modal */}
                          <td className="py-3.5 px-4">
                            <button
                              type="button"
                              onClick={() => setViewingTest(test)}
                              className="text-left group block cursor-pointer transition-colors"
                              title="Click to view student details"
                            >
                              <div className="font-bold text-[#0E113C] group-hover:text-[#E0910E] group-hover:underline transition-colors">
                                {test.studentName}
                              </div>
                              <div className="text-[11px] text-[#5A627A] font-mono group-hover:text-[#E0910E] transition-colors">
                                {test.studentId}
                              </div>
                            </button>
                          </td>

                          {/* Test Type */}
                          <td className="py-3.5 px-3">
                            <span className="font-bold text-xs px-2 py-0.5 rounded bg-[#EEF0F8] text-[#0E113C]">
                              {test.testType === 'LL' ? "LL (Learner's)" : "DL (Driving)"}
                            </span>
                          </td>

                          {/* Vehicle Category */}
                          <td className="py-3.5 px-3">
                            {test.testType === 'LL' ? (
                              <span className="font-semibold text-[#5A627A]">LMV / All</span>
                            ) : (test.category === 'LMV + M/C' || (test.category?.includes('LMV') && test.category?.includes('M/C'))) ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-black bg-[#0E113C] text-white tracking-wide shadow-xs">
                                <span>LMV</span>
                                <span className="text-[#FBA920]">+</span>
                                <span>M/C</span>
                              </span>
                            ) : (
                              <span className="font-semibold text-[#0E113C]">
                                {test.category || 'LMV'}
                              </span>
                            )}
                          </td>

                          {/* Test Date */}
                          <td className="py-3.5 px-3 whitespace-nowrap font-mono font-bold text-[#0E113C]">
                            {test.testDate}
                          </td>

                          {/* Attempt Type */}
                          <td className="py-3.5 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                test.attemptType === 'Retest'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-gray-100 text-gray-800 border-gray-300'
                              }`}
                            >
                              {test.attemptType} #{test.attemptNumber || 1}
                            </span>
                          </td>

                          {/* Status Indicator */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
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
                                {StatusIcon && (
                                  <StatusIcon className="w-3.5 h-3.5 shrink-0" />
                                )}
                                <span>{statusInfo.label}</span>
                              </span>
                            )}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              {/* Show Update button on Pending and Failed rows; hide only when Passed */}
                              {test.result !== 'Passed' && (
                                <button
                                  type="button"
                                  onClick={() => setUpdatingTest(test)}
                                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] transition-colors cursor-pointer"
                                  title="Update Result"
                                >
                                  Update
                                </button>
                              )}

                              {/* Delete Record */}
                              <button
                                type="button"
                                onClick={() => handleDeleteTest(test)}
                                className="p-1.5 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
          </div>
        )}

        {/* Tab 3: Recently Registered Students */}
        {activeSectionTab === 'recent-students' && (
          <div className="mt-2 pt-4 border-t border-[#E2E8F0]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[#0E113C] uppercase tracking-wider">
                Recently Registered Students
              </h3>
              <Link
                to="/students"
                className="text-xs font-bold text-[#0E113C] hover:text-[#E0910E] hover:underline flex items-center gap-1"
              >
                View all students ({stats.totalStudents})
                <ArrowUpRight className="w-3.5 h-3.5 text-[#FBA920]" />
              </Link>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0] min-w-0 w-full max-w-full">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3.5 px-4">Student Name</th>
                    <th className="py-3.5 px-4">Registration Date</th>
                    <th className="py-3.5 px-4">Class of Rule</th>
                    <th className="py-3.5 px-4 text-right">View Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {displayStudents.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-10 text-center text-xs text-[#94A3B8]">
                        No matching student records found.
                      </td>
                    </tr>
                  ) : (
                    displayStudents.map((st) => (
                      <tr key={st.id} className="hover:bg-[#F6F8FB] transition-colors">
                        <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={st.photo}
                              alt={st.name}
                              className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] shadow-xs"
                            />
                            <div>
                              <div className="text-[#0E113C]">{st.name}</div>
                              <div className="text-[11px] font-mono text-[#5A627A]">{st.id}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-[#5A627A]">
                          {st.startDate}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-md bg-[#FFF8EB] text-[#0E113C] text-xs font-semibold border border-[#FBA920]/30">
                            {st.classOfMode || st.classOfRule}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to={`/students/${st.id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#0E113C] text-[#FBA920] hover:bg-[#181C54] text-xs font-bold transition-colors shadow-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View Profile</span>
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Add Today's Driving Class Modal */}
      <AddDrivingClassModal
        isOpen={isAddDrivingClassOpen}
        onClose={() => setIsAddDrivingClassOpen(false)}
      />

      {/* Quick Update Test Result Modal */}
      <UpdateTestResultModal
        isOpen={!!updatingTest}
        onClose={() => setUpdatingTest(null)}
        test={updatingTest}
      />

      {/* Schedule Retest Modal */}
      <ScheduleRetestModal
        isOpen={!!retestingTest}
        onClose={() => setRetestingTest(null)}
        parentTest={retestingTest}
      />

      {/* View Test & Student Details Modal */}
      <ViewTestDetailsModal
        isOpen={!!viewingTest}
        onClose={() => setViewingTest(null)}
        test={viewingTest}
        onUpdateResult={(t) => setUpdatingTest(t)}
        onScheduleRetest={(t) => setRetestingTest(t)}
      />
    </div>
  );
}
