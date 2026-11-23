import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Home, Menu, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TopHeader({
  onToggleSidebar,
  onQuickAdd,
  onScheduleTest,
  onAddCarRecord,
  onAddBikeClass,
  onRecordStudentFee,
  onRecordEntry,
  onRecordPersonalEntry
}) {
  const location = useLocation();
  const {
    students,
    studentFilteredCount,
    openQuickAddModal,
    openScheduleTestModal,
    openAddCarModal,
    openAddBikeModal,
    openAddPaymentModal,
    openRecordEntryModal,
    drivingActiveTab,
    feesActiveTab
  } = useApp();

  const handleQuickAdd = onQuickAdd || openQuickAddModal;
  const handleScheduleTest = onScheduleTest || openScheduleTestModal;
  const handleAddCarRecord = onAddCarRecord || openAddCarModal;
  const handleAddBikeClass = onAddBikeClass || openAddBikeModal;
  const handleRecordStudentFee = onRecordStudentFee || (() => openAddPaymentModal && openAddPaymentModal(null, 'Regular Course Fees'));
  const handleRecordEntry = onRecordEntry || (() => openRecordEntryModal && openRecordEntryModal('Cash Income', null));
  const handleRecordPersonalEntry = onRecordPersonalEntry || (() => openRecordEntryModal && openRecordEntryModal('Personal Income', null));
  const isDashboard = location.pathname === '/';
  const isStudentsPage = location.pathname === '/students';
  const isTestsPage = location.pathname === '/tests';
  const isDrivingRecordsPage = location.pathname === '/driving-records';
  const isFeesPage = location.pathname === '/fees';
  const displayFilteredCount =
    studentFilteredCount !== null ? studentFilteredCount : students.length;

  // Determine Title and Breadcrumb from Pathname
  const getHeaderMeta = () => {
    const path = location.pathname;
    if (path === '/') {
      return {
        title: 'Dashboard',
        breadcrumbs: [{ label: 'Dashboard', path: '/' }]
      };
    }
    if (path === '/students') {
      return {
        title: 'Student Management',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Students', path: '/students' }
        ]
      };
    }
    if (path === '/students/add') {
      return {
        title: 'Add New Student',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Students', path: '/students' },
          { label: 'Add New Student', path: '/students/add' }
        ]
      };
    }
    if (path.startsWith('/students/')) {
      const studentId = path.split('/')[2];
      const student = students.find((s) => s.id === studentId);
      return {
        title: student ? student.name : 'Student Profile',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Students', path: '/students' },
          { label: student ? student.name : 'Profile', path: path }
        ]
      };
    }
    if (path === '/tests') {
      return {
        title: 'Test & Retest Management',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Test & Retest Management', path: '/tests' }
        ]
      };
    }
    if (path === '/driving-records') {
      return {
        title: 'Driving Records',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Driving Records', path: '/driving-records' }
        ]
      };
    }
    if (path === '/fees') {
      return {
        title: 'Fees & Payments',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Fees & Payments', path: '/fees' }
        ]
      };
    }
    if (path === '/reports') {
      return {
        title: 'Reports',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Reports', path: '/reports' }
        ]
      };
    }
    if (path === '/settings') {
      return {
        title: 'Settings',
        breadcrumbs: [
          { label: 'Dashboard', path: '/' },
          { label: 'Settings', path: '/settings' }
        ]
      };
    }
    return {
      title: 'DriveDesk',
      breadcrumbs: [{ label: 'Dashboard', path: '/' }]
    };
  };

  const { title, breadcrumbs } = getHeaderMeta();

  return (
    <header className="sticky top-0 z-30 bg-[#F6F8FB]/95 backdrop-blur-md border-b border-[#E2E8F0] px-3 py-2.5 sm:px-8 sm:py-5 flex items-center justify-between transition-all overflow-x-hidden w-full max-w-full min-w-0">
      {/* Left Title & Breadcrumbs */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 pr-2">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1.5 sm:p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] transition-colors shrink-0"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-base sm:text-2xl font-extrabold text-[#0E113C] tracking-tight leading-tight truncate">
            {isStudentsPage ? 'Student Management' : title}
          </h1>

          {isStudentsPage ? (
            <p className="text-xs sm:text-sm text-[#5A627A] mt-0.5 truncate">
              Showing {displayFilteredCount} of {students.length} total enrolled students
            </p>
          ) : isDashboard || isTestsPage || isDrivingRecordsPage || isFeesPage || breadcrumbs.length <= 1 ? null : (
            /* Breadcrumb path */
            <div className="flex items-center gap-1.5 text-[11px] sm:text-sm text-[#5A627A] mt-0.5 truncate">
              <Link
                to="/"
                className="flex items-center gap-1 hover:text-[#0E113C] transition-colors shrink-0"
              >
                <Home className="w-3.5 h-3.5 text-[#0E113C]" />
                <span className="font-semibold text-[#0E113C]">Dashboard</span>
              </Link>

              {breadcrumbs.length > 1 &&
                breadcrumbs.slice(1).map((crumb, idx) => (
                  <React.Fragment key={crumb.path}>
                    <span className="text-[#94A3B8]">/</span>
                    <Link
                      to={crumb.path}
                      className={`hover:text-[#0E113C] transition-colors truncate ${
                        idx === breadcrumbs.length - 2
                          ? 'text-[#0E113C] font-bold'
                          : 'text-[#5A627A]'
                      }`}
                    >
                      {crumb.label}
                    </Link>
                  </React.Fragment>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Action Button */}
      <div className="flex items-center shrink-0">
        {isStudentsPage ? (
          <Link
            to="/students/add"
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#0E113C] shrink-0" strokeWidth={2.8} />
            <span>Add New Student</span>
          </Link>
        ) : isTestsPage ? (
          <button
            type="button"
            onClick={handleScheduleTest}
            className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4 text-[#0E113C] shrink-0" strokeWidth={2.8} />
            <span>Schedule Test</span>
          </button>
        ) : isDrivingRecordsPage ? (
          drivingActiveTab === 'bike' ? (
            <button
              type="button"
              onClick={handleAddBikeClass}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#0E113C] shrink-0" strokeWidth={2.8} />
              <span>Add Bike Class (+₹300)</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleAddCarRecord}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs sm:text-sm font-bold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#0E113C] shrink-0" strokeWidth={2.8} />
              <span>Add Car Record</span>
            </button>
          )
        ) : isDashboard ? (
          <button
            type="button"
            onClick={handleQuickAdd}
            className="inline-flex items-center justify-center gap-1 sm:gap-2 px-2.5 py-1.5 sm:px-5 sm:py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs sm:text-sm font-bold rounded-full shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0E113C] shrink-0" strokeWidth={2.8} />
            <span className="hidden sm:inline">Quick Add Student</span>
            <span className="inline sm:hidden">Quick Add</span>
          </button>
        ) : isFeesPage ? (
          feesActiveTab === 'school_ledger' ? (
            <button
              type="button"
              onClick={handleRecordEntry}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#0E113C] shrink-0" strokeWidth={2.8} />
              <span>Record Entry</span>
            </button>
          ) : feesActiveTab === 'personal_account' ? (
            <button
              type="button"
              onClick={handleRecordPersonalEntry}
              className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 text-[#0E113C] shrink-0" strokeWidth={2.8} />
              <span>Record Personal Entry</span>
            </button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={handleRecordStudentFee}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#0E113C] hover:bg-[#181C54] text-white text-xs sm:text-sm font-extrabold rounded-xl shadow-md shadow-[#0E113C]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-[#FBA920] shrink-0" strokeWidth={2.8} />
                <span className="hidden sm:inline">Record Student Fee</span>
                <span className="inline sm:hidden">Student Fee</span>
              </button>
              <button
                type="button"
                onClick={handleRecordEntry}
                className="inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs sm:text-sm font-semibold rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4 text-[#0E113C] shrink-0" strokeWidth={2.8} />
                <span className="hidden sm:inline">Record Entry</span>
                <span className="inline sm:hidden">Record Entry</span>
              </button>
            </div>
          )
        ) : null}
      </div>
    </header>
  );
}
