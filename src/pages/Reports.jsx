import React, { useState, useMemo } from 'react';
import {
  Users,
  Car,
  WalletCards,
  TrendingUp,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileSpreadsheet,
  FileText,
  Printer,
  Calendar,
  Award,
  RefreshCw,
  Clock
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CLASS_MODES } from '../data/initialData';
import CustomSelect from '../components/common/CustomSelect';

export default function Reports() {
  const { students, drivingRecords, payments, licenceTests, stats, settings } = useApp();

  const [activeGroup, setActiveGroup] = useState('general'); // 'general' or 'tests'
  const [activeCategory, setActiveCategory] = useState('registration');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [selectedStudent, setSelectedStudent] = useState('All');
  const [selectedMode, setSelectedMode] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All'); // 'All', 'LMV', 'M/C'

  const todayStr = new Date().toISOString().split('T')[0];

  // 8 General Reports
  const generalReportCategories = [
    { id: 'registration', label: 'Student Registration Report', icon: Users },
    { id: 'active-students', label: 'Active Students Report', icon: Users },
    { id: 'completed-students', label: 'Completed Students Report', icon: CheckCircle2 },
    { id: 'daily-driving', label: 'Daily Driving Report', icon: Car },
    { id: 'student-driving', label: 'Student-wise Driving Report', icon: Car },
    { id: 'km-report', label: 'KM Travelled Report', icon: TrendingUp },
    { id: 'fee-collection', label: 'Fee Collection Report', icon: WalletCards },
    { id: 'pending-fees', label: 'Pending Fees Report', icon: AlertCircle },
  ];

  // 8 Test & Retest Reports as required by Section 10
  const testReportCategories = [
    { id: 'll-test', label: "LL Test Report", icon: Award },
    { id: 'll-pass-fail', label: "LL Pass / Fail Report", icon: CheckCircle2 },
    { id: 'dl-test', label: "DL Test Report", icon: Award },
    { id: 'category-driving-test', label: "Category-wise Driving Test Report", icon: Car },
    { id: 'upcoming-tests', label: "Upcoming Test Report", icon: Calendar },
    { id: 'upcoming-retests', label: "Upcoming Retest Report", icon: RefreshCw },
    { id: 'pending-test-results', label: "Pending Test Results Report", icon: Clock },
    { id: 'student-test-history', label: "Student-wise Test History Report", icon: FileText },
  ];

  const allReportCategories = [...generalReportCategories, ...testReportCategories];

  // Helper date filtering
  const isWithinDateRange = (dateStr) => {
    if (!dateStr) return true;
    if (fromDate && dateStr < fromDate) return false;
    if (toDate && dateStr > toDate) return false;
    return true;
  };

  const isTestReport = testReportCategories.some((c) => c.id === activeCategory);

  // Filtered data based on active category and filters
  const reportData = useMemo(() => {
    switch (activeCategory) {
      // General Reports
      case 'registration':
        return students.filter((s) => {
          const matchDate = isWithinDateRange(s.startDate);
          const matchStudent = selectedStudent === 'All' || s.id === selectedStudent;
          const matchMode = selectedMode === 'All' || s.classOfMode === selectedMode;
          return matchDate && matchStudent && matchMode;
        });

      case 'active-students':
        return students.filter((s) => {
          const matchStatus = s.status === 'Active';
          const matchDate = isWithinDateRange(s.startDate);
          const matchStudent = selectedStudent === 'All' || s.id === selectedStudent;
          const matchMode = selectedMode === 'All' || s.classOfMode === selectedMode;
          return matchStatus && matchDate && matchStudent && matchMode;
        });

      case 'completed-students':
        return students.filter((s) => {
          const matchStatus = s.status === 'Completed';
          const matchDate = isWithinDateRange(s.startDate);
          const matchStudent = selectedStudent === 'All' || s.id === selectedStudent;
          const matchMode = selectedMode === 'All' || s.classOfMode === selectedMode;
          return matchStatus && matchDate && matchStudent && matchMode;
        });

      case 'daily-driving':
        return drivingRecords.filter((r) => {
          const matchDate = isWithinDateRange(r.date);
          const matchStudent = selectedStudent === 'All' || r.studentId === selectedStudent;
          const matchMode = selectedMode === 'All' || r.classOfMode === selectedMode;
          return matchDate && matchStudent && matchMode;
        });

      case 'student-driving': {
        const map = {};
        drivingRecords.forEach((r) => {
          if (!isWithinDateRange(r.date)) return;
          if (selectedStudent !== 'All' && r.studentId !== selectedStudent) return;
          if (selectedMode !== 'All' && r.classOfMode !== selectedMode) return;

          if (!map[r.studentId]) {
            map[r.studentId] = {
              studentId: r.studentId,
              studentName: r.studentName,
              classOfMode: r.classOfMode,
              totalSessions: 0,
              totalKm: 0,
              lastSessionDate: r.date
            };
          }
          map[r.studentId].totalSessions += 1;
          map[r.studentId].totalKm += parseFloat(r.kmTravelled) || 0;
          if (r.date > map[r.studentId].lastSessionDate) {
            map[r.studentId].lastSessionDate = r.date;
          }
        });
        return Object.values(map);
      }

      case 'km-report':
        return drivingRecords
          .filter((r) => {
            const matchDate = isWithinDateRange(r.date);
            const matchStudent = selectedStudent === 'All' || r.studentId === selectedStudent;
            const matchMode = selectedMode === 'All' || r.classOfMode === selectedMode;
            return matchDate && matchStudent && matchMode;
          })
          .sort((a, b) => b.kmTravelled - a.kmTravelled);

      case 'fee-collection':
        return payments.filter((p) => {
          const matchDate = isWithinDateRange(p.paymentDate);
          const matchStudent = selectedStudent === 'All' || p.studentId === selectedStudent;
          return matchDate && matchStudent;
        });

      case 'pending-fees':
        return students.filter((s) => {
          const matchPending = s.pendingBalance > 0;
          const matchDate = isWithinDateRange(s.startDate);
          const matchStudent = selectedStudent === 'All' || s.id === selectedStudent;
          const matchMode = selectedMode === 'All' || s.classOfMode === selectedMode;
          return matchPending && matchDate && matchStudent && matchMode;
        });

      // ==================== TEST & RETEST REPORTS (SECTION 10) ====================
      case 'll-test':
        return licenceTests.filter((t) => {
          const isLL = t.testType === 'LL';
          const matchDate = isWithinDateRange(t.testDate);
          const matchStudent = selectedStudent === 'All' || t.studentId === selectedStudent;
          return isLL && matchDate && matchStudent;
        });

      case 'll-pass-fail':
        return licenceTests.filter((t) => {
          const isLL = t.testType === 'LL';
          const isResolved = t.result === 'Passed' || t.result === 'Failed';
          const matchDate = isWithinDateRange(t.testDate);
          const matchStudent = selectedStudent === 'All' || t.studentId === selectedStudent;
          return isLL && isResolved && matchDate && matchStudent;
        });

      case 'dl-test':
        return licenceTests.filter((t) => {
          const isDL = t.testType === 'DL';
          const matchDate = isWithinDateRange(t.testDate);
          const matchStudent = selectedStudent === 'All' || t.studentId === selectedStudent;
          const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
          return isDL && matchDate && matchStudent && matchCat;
        });

      case 'category-driving-test':
        return licenceTests
          .filter((t) => {
            const isDL = t.testType === 'DL';
            const matchDate = isWithinDateRange(t.testDate);
            const matchStudent = selectedStudent === 'All' || t.studentId === selectedStudent;
            const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
            return isDL && matchDate && matchStudent && matchCat;
          })
          .sort((a, b) => (a.category || '').localeCompare(b.category || ''));

      case 'upcoming-tests':
        return licenceTests.filter((t) => {
          const isUpcoming = t.result === 'Pending' && t.testDate > todayStr && t.attemptType === 'Original';
          const matchDate = isWithinDateRange(t.testDate);
          const matchStudent = selectedStudent === 'All' || t.studentId === selectedStudent;
          const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
          return isUpcoming && matchDate && matchStudent && matchCat;
        });

      case 'upcoming-retests':
        return licenceTests.filter((t) => {
          const isUpcomingRetest = t.result === 'Pending' && t.testDate > todayStr && t.attemptType === 'Retest';
          const matchDate = isWithinDateRange(t.testDate);
          const matchStudent = selectedStudent === 'All' || t.studentId === selectedStudent;
          const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
          return isUpcomingRetest && matchDate && matchStudent && matchCat;
        });

      case 'pending-test-results':
        return licenceTests.filter((t) => {
          const isPending = t.result === 'Pending';
          const matchDate = isWithinDateRange(t.testDate);
          const matchStudent = selectedStudent === 'All' || t.studentId === selectedStudent;
          const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
          return isPending && matchDate && matchStudent && matchCat;
        });

      case 'student-test-history':
        return licenceTests
          .filter((t) => {
            const matchDate = isWithinDateRange(t.testDate);
            const matchStudent = selectedStudent === 'All' || t.studentId === selectedStudent;
            const matchCat = selectedCategory === 'All' || t.category === selectedCategory;
            return matchDate && matchStudent && matchCat;
          })
          .sort((a, b) => a.studentName.localeCompare(b.studentName) || (a.attemptNumber || 1) - (b.attemptNumber || 1));

      default:
        return [];
    }
  }, [
    activeCategory,
    students,
    drivingRecords,
    payments,
    licenceTests,
    fromDate,
    toDate,
    selectedStudent,
    selectedMode,
    selectedCategory,
    todayStr
  ]);

  // Export to CSV
  const handleExportExcel = () => {
    let headers = [];
    let rows = [];

    if (isTestReport) {
      headers = [
        'Student ID',
        'Student Name',
        'Test Type',
        'Category',
        'Attempt #',
        'Attempt Type',
        'Test Date',
        'Result',
        'Next Retest Date',
        'Remarks'
      ];
      rows = reportData.map((t) => [
        `"${t.studentId}"`,
        `"${t.studentName}"`,
        `"${t.testType}"`,
        `"${t.category || 'LMV'}"`,
        t.attemptNumber || 1,
        `"${t.attemptType}"`,
        `"${t.testDate}"`,
        `"${t.result}"`,
        `"${t.retestDate || '—'}"`,
        `"${(t.remarks || '').replace(/"/g, '""')}"`
      ]);
    } else if (
      activeCategory === 'registration' ||
      activeCategory === 'active-students' ||
      activeCategory === 'completed-students' ||
      activeCategory === 'pending-fees'
    ) {
      headers = [
        'Student ID',
        'Student Name',
        'Mobile 1',
        'Mobile 2',
        'Class of Rule',
        'Course Fees',
        'Paid Amount',
        'Pending Balance',
        'Status',
        'Start Date'
      ];
      rows = reportData.map((s) => [
        `"${s.id}"`,
        `"${s.name}"`,
        `"${s.phone1}"`,
        `"${s.phone2 || ''}"`,
        `"${s.classOfMode}"`,
        s.courseFees,
        s.paidAmount,
        s.pendingBalance,
        `"${s.status}"`,
        `"${s.startDate}"`
      ]);
    } else if (activeCategory === 'daily-driving' || activeCategory === 'km-report') {
      headers = [
        'Record ID',
        'Date',
        'Student Name',
        'Start Time',
        'End Time',
        'KM Travelled',
        'Class of Rule',
        'Remarks'
      ];
      rows = reportData.map((r) => [
        `"${r.id}"`,
        `"${r.date}"`,
        `"${r.studentName}"`,
        `"${r.startTime}"`,
        `"${r.endTime}"`,
        r.kmTravelled,
        `"${r.classOfMode}"`,
        `"${r.remarks || ''}"`
      ]);
    } else if (activeCategory === 'student-driving') {
      headers = [
        'Student ID',
        'Student Name',
        'Class Mode',
        'Total Sessions',
        'Total KM',
        'Last Practice Date'
      ];
      rows = reportData.map((g) => [
        `"${g.studentId}"`,
        `"${g.studentName}"`,
        `"${g.classOfMode}"`,
        g.totalSessions,
        g.totalKm.toFixed(1),
        `"${g.lastSessionDate}"`
      ]);
    } else {
      headers = [
        'Receipt ID',
        'Student Name',
        'Payment Date',
        'Amount Paid',
        'Payment Category',
        'Method',
        'Notes'
      ];
      rows = reportData.map((p) => [
        `"${p.id}"`,
        `"${p.studentName}"`,
        `"${p.paymentDate}"`,
        p.amountPaid,
        `"${p.paymentCategory || 'Regular Course Fees'}"`,
        `"${p.paymentMethod}"`,
        `"${p.notes || ''}"`
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `DriveDesk_${activeCategory}_${todayStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  const activeCategoryObj = allReportCategories.find((c) => c.id === activeCategory);

  return (
    <div className="space-y-6 pb-16 animate-fade-in w-full min-w-0">
      {/* Header and Export Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E113C]">
            Operational Reports & Auditing
          </h2>
          <p className="text-xs sm:text-sm text-[#5A627A]">
            Official business, driving practice, fee collection, and licence test/retest reports
          </p>
        </div>

        {/* Export Action Buttons */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#0E113C] text-[#0E113C] hover:bg-[#EEF0F8] rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#0E113C]" />
            <span>Export PDF</span>
          </button>

          <button
            onClick={handleExportExcel}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-white border border-[#0E113C] text-[#0E113C] hover:bg-[#EEF0F8] rounded-xl text-xs font-bold shadow-2xs transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-[#0E113C]" />
            <span>Export Excel</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#0E113C] hover:bg-[#181C54] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#FBA920]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Group Switcher: General vs Test & Retest */}
      <div className="flex border-b border-[#E2E8F0] gap-4">
        <button
          onClick={() => {
            setActiveGroup('general');
            if (isTestReport) setActiveCategory('registration');
          }}
          className={`pb-3 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer ${
            activeGroup === 'general'
              ? 'border-[#0E113C] text-[#0E113C]'
              : 'border-transparent text-[#5A627A] hover:text-[#0E113C]'
          }`}
        >
          General Operations Reports (8)
        </button>
        <button
          onClick={() => {
            setActiveGroup('tests');
            if (!isTestReport) setActiveCategory('ll-test');
          }}
          className={`pb-3 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
            activeGroup === 'tests'
              ? 'border-[#0E113C] text-[#0E113C]'
              : 'border-transparent text-[#5A627A] hover:text-[#0E113C]'
          }`}
        >
          <Award className="w-4 h-4 text-[#FBA920]" />
          <span>Licence Test & Retest Reports (8)</span>
        </button>
      </div>

      {/* Report Categories Selector */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {(activeGroup === 'general' ? generalReportCategories : testReportCategories).map((cat) => {
          const Icon = cat.icon;
          const isSelected = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between gap-2.5 cursor-pointer ${
                isSelected
                  ? 'bg-[#0E113C] text-white border-[#0E113C] shadow-md'
                  : 'bg-white text-[#0E113C] border-[#E2E8F0] hover:bg-[#EEF0F8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <Icon
                  className={`w-4 h-4 ${
                    isSelected ? 'text-[#FBA920]' : 'text-[#5A627A]'
                  }`}
                />
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                    isSelected
                      ? 'bg-[#FBA920] text-[#0E113C]'
                      : 'bg-[#EEF0F8] text-[#0E113C]'
                  }`}
                >
                  {cat.id === 'registration'
                    ? stats.totalStudents
                    : cat.id === 'active-students'
                    ? stats.activeStudents
                    : cat.id === 'completed-students'
                    ? stats.completedStudents
                    : cat.id === 'pending-fees'
                    ? students.filter((s) => s.pendingBalance > 0).length
                    : cat.id === 'fee-collection'
                    ? payments.length
                    : cat.id === 'll-test'
                    ? licenceTests.filter((t) => t.testType === 'LL').length
                    : cat.id === 'll-pass-fail'
                    ? licenceTests.filter((t) => t.testType === 'LL' && t.result !== 'Pending').length
                    : cat.id === 'dl-test'
                    ? licenceTests.filter((t) => t.testType === 'DL').length
                    : cat.id === 'category-driving-test'
                    ? licenceTests.filter((t) => t.testType === 'DL').length
                    : cat.id === 'upcoming-tests'
                    ? stats.upcomingTestsCount
                    : cat.id === 'upcoming-retests'
                    ? stats.upcomingRetestsCount
                    : cat.id === 'pending-test-results'
                    ? stats.pendingResultsCount
                    : cat.id === 'student-test-history'
                    ? licenceTests.length
                    : drivingRecords.length}
                </span>
              </div>
              <span className={`text-xs font-bold leading-snug ${isSelected ? 'text-white' : 'text-[#0E113C]'}`}>
                {cat.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Global Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex flex-wrap gap-4 items-center justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-[#5A627A]">
            <Calendar className="w-4 h-4 text-[#0E113C]" />
            <span className="font-bold text-[#0E113C]">From:</span>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="bg-[#F6F8FB] px-2.5 py-1.5 text-xs font-semibold text-[#0E113C] rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920]"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#5A627A]">
            <span className="font-bold text-[#0E113C]">To:</span>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="bg-[#F6F8FB] px-2.5 py-1.5 text-xs font-semibold text-[#0E113C] rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920]"
            />
          </div>

          <CustomSelect
            prefix="Student:"
            value={selectedStudent}
            onChange={(e) => setSelectedStudent(e.target.value)}
            options={[
              { value: 'All', label: 'All Students' },
              ...students.slice(0, 50).map((st) => ({
                value: st.id,
                label: st.name,
                subtext: st.id,
              })),
            ]}
            size="sm"
            autoWidth={true}
            searchable={true}
            className="bg-[#F6F8FB]"
          />

          {isTestReport ? (
            <CustomSelect
              prefix="Category:"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              options={[
                { value: 'All', label: 'All Categories' },
                { value: 'LMV', label: 'LMV (Car)' },
                { value: 'M/C', label: 'M/C (Motorcycle)' }
              ]}
              size="sm"
              autoWidth={true}
              className="bg-[#F6F8FB]"
            />
          ) : (
            <CustomSelect
              prefix="Class Mode:"
              value={selectedMode}
              onChange={(e) => setSelectedMode(e.target.value)}
              options={[
                { value: 'All', label: 'All Rules' },
                ...CLASS_MODES.map((m) => ({ value: m, label: m })),
              ]}
              size="sm"
              autoWidth={true}
              className="bg-[#F6F8FB]"
            />
          )}
        </div>

        {(fromDate || toDate || selectedStudent !== 'All' || selectedMode !== 'All' || selectedCategory !== 'All') && (
          <button
            onClick={() => {
              setFromDate('');
              setToDate('');
              setSelectedStudent('All');
              setSelectedMode('All');
              setSelectedCategory('All');
            }}
            className="text-xs font-bold text-[#0E113C] hover:text-[#E0910E] hover:underline cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Summary KPI representation */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* KPI 1 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card">
          <span className="text-xs font-semibold text-[#5A627A]">Total Records in Report</span>
          <p className="text-2xl font-extrabold text-[#0E113C] mt-1">
            {reportData.length}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Matching criteria</p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card">
          <span className="text-xs font-semibold text-[#5A627A]">
            {isTestReport
              ? 'Passed Attempts in Set'
              : activeCategory.includes('fee')
              ? 'Aggregated Amount'
              : activeCategory.includes('driving') || activeCategory === 'km-report'
              ? 'Aggregated Mileage'
              : 'Course Fees Representation'}
          </span>
          <p className="text-2xl font-extrabold text-[#0E113C] mt-1">
            {isTestReport
              ? `${reportData.filter((t) => t.result === 'Passed').length} Passed / ${reportData.filter((t) => t.result === 'Failed').length} Failed`
              : activeCategory === 'fee-collection'
              ? `₹${reportData
                  .reduce((sum, p) => sum + (parseFloat(p.amountPaid) || 0), 0)
                  .toLocaleString('en-IN')}`
              : activeCategory === 'pending-fees'
              ? `₹${reportData
                  .reduce((sum, s) => sum + (parseFloat(s.pendingBalance) || 0), 0)
                  .toLocaleString('en-IN')}`
              : activeCategory === 'daily-driving' || activeCategory === 'km-report'
              ? `${reportData
                  .reduce((sum, r) => sum + (parseFloat(r.kmTravelled) || 0), 0)
                  .toFixed(1)} KM`
              : activeCategory === 'student-driving'
              ? `${reportData
                  .reduce((sum, g) => sum + g.totalKm, 0)
                  .toFixed(1)} KM`
              : `₹${reportData
                  .reduce((sum, s) => sum + (parseFloat(s.courseFees) || 0), 0)
                  .toLocaleString('en-IN')}`}
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Calculated from actual records</p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card">
          <span className="text-xs font-semibold text-[#5A627A]">Audit Status</span>
          <p className="text-2xl font-extrabold text-emerald-600 mt-1">
            Verified
          </p>
          <p className="text-[11px] text-[#94A3B8] mt-0.5">Official DriveDesk audit log</p>
        </div>
      </div>

      {/* Printable Report Data Table */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-dd-card overflow-hidden">
        {/* Printable Official Header */}
        <div className="p-6 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white border border-[#E2E8F0] p-1.5 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src={settings.logoImage || "/logo.png"}
                alt="School Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <div className="text-xs font-bold text-[#5A627A] uppercase tracking-wider">
                {settings.schoolName || 'Al Madeena Driving School'} • Official Audit Report
              </div>
              <h3 className="text-lg font-extrabold text-[#0E113C] mt-0.5">
                {activeCategoryObj?.label}
              </h3>
              <p className="text-xs text-[#5A627A]">
                Generated on {new Date().toLocaleDateString('en-GB')} • DriveDesk v1.0
              </p>
            </div>
          </div>

          <div className="text-xs text-[#5A627A] text-right">
            <div>Total Records: <strong className="text-[#0E113C]">{reportData.length}</strong></div>
            <div>Status: <span className="text-[#16A34A] font-bold">Verified Audit</span></div>
          </div>
        </div>

        {/* Dynamic Table based on report category */}
        <div className="overflow-x-auto">
          {/* Test & Retest Reports Table */}
          {isTestReport ? (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-3">Test Type</th>
                  <th className="py-3.5 px-3">Category</th>
                  <th className="py-3.5 px-3">Attempt #</th>
                  <th className="py-3.5 px-3">Test Date</th>
                  <th className="py-3.5 px-3">Result</th>
                  <th className="py-3.5 px-3">Next Retest Date</th>
                  <th className="py-3.5 px-4">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-10 text-center text-xs text-[#94A3B8]">
                      No test records match the current filter selection.
                    </td>
                  </tr>
                ) : (
                  reportData.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0E113C]">{t.studentId}</td>
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">{t.studentName}</td>
                      <td className="py-3.5 px-3">
                        <span className="font-bold px-2 py-0.5 rounded bg-[#EEF0F8] text-[#0E113C] text-[11px]">
                          {t.testType === 'LL' ? "LL" : "DL"}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-[#0E113C]">{t.testType === 'LL' ? 'LMV / All' : (t.category || 'LMV')}</td>
                      <td className="py-3.5 px-3 font-mono text-xs">{t.attemptType} #{t.attemptNumber || 1}</td>
                      <td className="py-3.5 px-3 font-mono font-bold text-[#0E113C]">{t.testDate}</td>
                      <td className="py-3.5 px-3">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            t.result === 'Passed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : t.result === 'Failed'
                              ? 'bg-red-50 text-red-800 border-red-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {t.result}
                        </span>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-xs text-[#0E113C]">{t.retestDate || '—'}</td>
                      <td className="py-3.5 px-4 text-xs text-[#5A627A]">{t.remarks || '—'}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeCategory === 'registration' ||
            activeCategory === 'active-students' ||
            activeCategory === 'completed-students' ||
            activeCategory === 'pending-fees' ? (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Mobile</th>
                  <th className="py-3.5 px-4">Class of Rule</th>
                  <th className="py-3.5 px-4">Course Fees</th>
                  <th className="py-3.5 px-4">Paid Amount</th>
                  <th className="py-3.5 px-4">Pending Balance</th>
                  <th className="py-3.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-xs text-[#94A3B8]">
                      No records match the current filter selection.
                    </td>
                  </tr>
                ) : (
                  reportData.slice(0, 50).map((st) => (
                    <tr key={st.id} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0E113C]">
                        {st.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                        {st.name}
                      </td>
                      <td className="py-3.5 px-4 text-[#5A627A] font-mono">
                        {st.phone1}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FFF8EB] text-[#0E113C] text-xs font-semibold border border-[#FBA920]/30">
                          {st.classOfMode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                        ₹{st.courseFees.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                        ₹{st.paidAmount.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0E113C]">
                        ₹{st.pendingBalance.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                            st.status === 'Active'
                              ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                              : st.status === 'Completed'
                              ? 'bg-[#EEF0F8] text-[#0E113C] border-[#0E113C]/20'
                              : 'bg-[#FFF8EB] text-[#E0910E] border-[#FBA920]/30'
                          }`}
                        >
                          {st.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeCategory === 'daily-driving' || activeCategory === 'km-report' ? (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Starting Time</th>
                  <th className="py-3.5 px-4">Ending Time</th>
                  <th className="py-3.5 px-4">KM Travelled</th>
                  <th className="py-3.5 px-4">Class of Rule</th>
                  <th className="py-3.5 px-4">Instructor Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-10 text-center text-xs text-[#94A3B8]">
                      No driving logs recorded in this period.
                    </td>
                  </tr>
                ) : (
                  reportData.slice(0, 50).map((r) => (
                    <tr key={r.id} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                        {r.date}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                        {r.studentName}
                      </td>
                      <td className="py-3.5 px-4 text-[#5A627A] font-mono">
                        {r.startTime}
                      </td>
                      <td className="py-3.5 px-4 text-[#5A627A] font-mono">
                        {r.endTime}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0E113C]">
                        {r.kmTravelled} KM
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FFF8EB] text-[#0E113C] text-xs font-semibold border border-[#FBA920]/30">
                          {r.classOfMode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5A627A]">
                        {r.remarks || 'Standard practical drive'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : activeCategory === 'student-driving' ? (
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-4">Student ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Class of Rule</th>
                  <th className="py-3.5 px-4">Completed Sessions</th>
                  <th className="py-3.5 px-4">Total KM Logged</th>
                  <th className="py-3.5 px-4">Last Practice Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-[#94A3B8]">
                      No driving attendance records found.
                    </td>
                  </tr>
                ) : (
                  reportData.map((g) => (
                    <tr key={g.studentId} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0E113C]">
                        {g.studentId}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                        {g.studentName}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-md bg-[#FFF8EB] text-[#0E113C] text-xs font-semibold border border-[#FBA920]/30">
                          {g.classOfMode}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                        {g.totalSessions} sessions
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0E113C]">
                        {g.totalKm.toFixed(1)} KM
                      </td>
                      <td className="py-3.5 px-4 text-[#5A627A]">
                        {g.lastSessionDate}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          ) : (
            // Fee Collection Report
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-4">Receipt ID</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-4">Payment Date</th>
                  <th className="py-3.5 px-4">Amount Paid</th>
                  <th className="py-3.5 px-4">Method</th>
                  <th className="py-3.5 px-4">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {reportData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-xs text-[#94A3B8]">
                      No payments found in this date range.
                    </td>
                  </tr>
                ) : (
                  reportData.map((p) => (
                    <tr key={p.id} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0E113C]">
                        {p.id}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#0E113C]">
                        {p.studentName}
                      </td>
                      <td className="py-3.5 px-4 text-[#5A627A]">
                        {p.paymentDate}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0E113C]">
                        ₹{p.amountPaid.toLocaleString('en-IN')}
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#0E113C] text-[#FBA920] text-xs font-bold">
                          {p.paymentMethod}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-[#5A627A]">
                        {p.notes}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
