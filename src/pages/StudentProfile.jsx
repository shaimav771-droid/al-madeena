import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  FileText,
  BookOpen,
  Car,
  Bike,
  WalletCards,
  FileCheck,
  Edit3,
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Download,
  Plus,
  Printer,
  Trash2,
  ShieldCheck,
  Award,
  Search,
  RefreshCw,
  Check,
  X,
  IndianRupee,
  Wallet
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import EditStudentModal from '../components/modals/EditStudentModal';
import AddDrivingRecordModal from '../components/modals/AddDrivingRecordModal';
import EditDrivingRecordModal from '../components/modals/EditDrivingRecordModal';
import AddBikeClassModal from '../components/modals/AddBikeClassModal';
import EditBikeClassModal from '../components/modals/EditBikeClassModal';
import AddPaymentModal from '../components/modals/AddPaymentModal';
import StudentRecordCardModal from '../components/modals/StudentRecordCardModal';
import ScheduleTestModal from '../components/modals/ScheduleTestModal';
import UpdateTestResultModal from '../components/modals/UpdateTestResultModal';
import ScheduleRetestModal from '../components/modals/ScheduleRetestModal';

export default function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    students,
    drivingRecords,
    bikeClasses,
    payments,
    licenceTests,
    deleteDrivingRecord,
    deleteBikeClass,
    deleteTestRecord,
    getStudentFinancials,
    updateStudent,
    settings
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditingOfficeCode, setIsEditingOfficeCode] = useState(false);
  const [officeCodeInput, setOfficeCodeInput] = useState('');
  const [isAddDrivingOpen, setIsAddDrivingOpen] = useState(false);
  const [editingDrivingRecord, setEditingDrivingRecord] = useState(null);
  const [isAddBikeOpen, setIsAddBikeOpen] = useState(false);
  const [editingBikeClass, setEditingBikeClass] = useState(null);
  const [isAddPaymentOpen, setIsAddPaymentOpen] = useState(false);
  const [isRecordCardOpen, setIsRecordCardOpen] = useState(false);
  const [receiptToPrint, setReceiptToPrint] = useState(null);

  // Test modals
  const [isScheduleTestOpen, setIsScheduleTestOpen] = useState(false);
  const [defaultScheduleType, setDefaultScheduleType] = useState('LL');
  const [defaultScheduleCategory, setDefaultScheduleCategory] = useState('LMV');
  const [updatingTest, setUpdatingTest] = useState(null);
  const [retestingTest, setRetestingTest] = useState(null);

  // Search states within tabs
  const [carSearch, setCarSearch] = useState('');
  const [bikeSearch, setBikeSearch] = useState('');
  const [testSearch, setTestSearch] = useState('');

  // Find the selected student
  const student = useMemo(() => {
    return students.find((s) => s.id === id) || students[0];
  }, [students, id]);

  // Compute student financial summary
  const financials = useMemo(() => {
    if (!student) return null;
    return getStudentFinancials(student.id) || {
      regularCourseFees: student.courseFees || 0,
      additionalBikeClassesCount: 0,
      additionalBikeCharges: 0,
      totalPayable: student.courseFees || 0,
      totalPaid: student.paidAmount || 0,
      regularPaid: student.paidAmount || 0,
      bikePaid: 0,
      pendingBalance: student.pendingBalance || 0,
      pendingRegular: student.pendingBalance || 0,
      pendingBike: 0
    };
  }, [student, getStudentFinancials, bikeClasses, payments]);

  // Car driving records strictly belonging to this student
  const studentDrivingRecords = useMemo(() => {
    if (!student) return [];
    return drivingRecords.filter(
      (r) => r.studentId === student.id || r.studentName === student.name
    );
  }, [drivingRecords, student]);

  const filteredCarRecords = useMemo(() => {
    if (!carSearch.trim()) return studentDrivingRecords;
    const q = carSearch.toLowerCase().trim();
    return studentDrivingRecords.filter(
      (r) =>
        r.date.includes(q) ||
        (r.practiceDetails && r.practiceDetails.toLowerCase().includes(q)) ||
        (r.vehicleDetails && r.vehicleDetails.toLowerCase().includes(q)) ||
        (r.instructor && r.instructor.toLowerCase().includes(q))
    );
  }, [studentDrivingRecords, carSearch]);

  // Bike class records strictly belonging to this student
  const studentBikeClasses = useMemo(() => {
    if (!student) return [];
    return bikeClasses.filter(
      (b) => b.studentId === student.id || b.studentName === student.name
    );
  }, [bikeClasses, student]);

  const filteredBikeClasses = useMemo(() => {
    if (!bikeSearch.trim()) return studentBikeClasses;
    const q = bikeSearch.toLowerCase().trim();
    return studentBikeClasses.filter(
      (b) =>
        b.date.includes(q) ||
        (b.vehicleDetails && b.vehicleDetails.toLowerCase().includes(q)) ||
        (b.instructor && b.instructor.toLowerCase().includes(q)) ||
        (b.remarks && b.remarks.toLowerCase().includes(q))
    );
  }, [studentBikeClasses, bikeSearch]);

  // Licence Tests strictly belonging to this student
  const studentTests = useMemo(() => {
    if (!student) return [];
    return licenceTests
      .filter((t) => t.studentId === student.id || t.studentName === student.name)
      .sort((a, b) => new Date(a.testDate) - new Date(b.testDate));
  }, [licenceTests, student]);

  // Categorized test records
  const llTests = useMemo(() => studentTests.filter((t) => t.testType === 'LL'), [studentTests]);
  const dlLmvTests = useMemo(() => studentTests.filter((t) => t.testType === 'DL' && (t.category === 'LMV' || !t.category || t.category.includes('LMV'))), [studentTests]);
  const dlMcTests = useMemo(() => studentTests.filter((t) => t.testType === 'DL' && (t.category === 'M/C' || t.category.includes('M/C'))), [studentTests]);

  const latestLL = llTests[llTests.length - 1];
  const latestDLLmv = dlLmvTests[dlLmvTests.length - 1];
  const latestDLMc = dlMcTests[dlMcTests.length - 1];

  // Filtered tests in table
  const filteredTests = useMemo(() => {
    if (!testSearch.trim()) return studentTests;
    const q = testSearch.toLowerCase().trim();
    return studentTests.filter(
      (t) =>
        t.testDate.includes(q) ||
        t.testType.toLowerCase().includes(q) ||
        (t.category && t.category.toLowerCase().includes(q)) ||
        t.result.toLowerCase().includes(q) ||
        (t.remarks && t.remarks.toLowerCase().includes(q))
    );
  }, [studentTests, testSearch]);

  // Payments strictly belonging to this student
  const studentPayments = useMemo(() => {
    if (!student) return [];
    return payments.filter(
      (p) => p.studentId === student.id || p.studentName === student.name
    );
  }, [payments, student]);

  // Total KM driven in car
  const totalCarKm = useMemo(() => {
    return studentDrivingRecords.reduce((sum, r) => sum + (parseFloat(r.kmTravelled) || 0), 0);
  }, [studentDrivingRecords]);

  // Total KM in bike
  const totalBikeKm = useMemo(() => {
    return studentBikeClasses.reduce((sum, b) => sum + (parseFloat(b.kmTravelled) || 0), 0);
  }, [studentBikeClasses]);

  // Total bike duration in minutes
  const totalBikeDuration = useMemo(() => {
    return studentBikeClasses.reduce((sum, b) => sum + (parseInt(b.durationMinutes, 10) || 45), 0);
  }, [studentBikeClasses]);

  if (!student) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-base font-bold text-[#0E113C]">Student not found</p>
        <button
          onClick={() => navigate('/students')}
          className="px-5 py-2.5 bg-[#FBA920] text-[#0E113C] font-bold rounded-xl text-xs shadow-sm cursor-pointer"
        >
          Return to Students
        </button>
      </div>
    );
  }

  const handleDeleteCarRecord = (recId) => {
    if (window.confirm('Are you sure you want to delete this car driving record?')) {
      deleteDrivingRecord(recId);
    }
  };

  const handleDeleteBikeClass = (classId) => {
    if (window.confirm('Delete this bike class entry? The associated ₹300 charge will be updated automatically.')) {
      deleteBikeClass(classId);
    }
  };

  const handleDeleteTest = (testId) => {
    if (window.confirm('Delete this test record?')) {
      deleteTestRecord(testId);
    }
  };

  const openScheduleModal = (type = 'LL', cat = 'LMV') => {
    setDefaultScheduleType(type);
    setDefaultScheduleCategory(cat);
    setIsScheduleTestOpen(true);
  };

  const handleSaveOfficeCode = (e) => {
    if (e) e.preventDefault();
    if (student) {
      updateStudent(student.id, { officeCode: officeCodeInput.trim() || student.officeCode || 'KL11-CLT-01' });
    }
    setIsEditingOfficeCode(false);
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in w-full min-w-0">
      {/* Top Back Navigation & Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          onClick={() => navigate('/students')}
          className="inline-flex items-center gap-2 text-xs font-bold text-[#5A627A] hover:text-[#0E113C] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Students Directory</span>
        </button>

        <div className="flex items-center gap-2.5">
          {/* DIGITAL STUDENT RECORD CARD BUTTON */}
          <button
            onClick={() => setIsRecordCardOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E113C] hover:bg-[#181C54] text-[#FBA920] rounded-xl text-xs font-bold shadow-md shadow-[#0E113C]/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-[#FBA920]" />
            <span>View / Print Student Record Card</span>
          </button>
        </div>
      </div>

      {/* Profile Header Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <img
            src={student.photo}
            alt={student.name}
            className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-[#E2E8F0] shadow-sm shrink-0 bg-[#EEF0F8]"
          />
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E113C] tracking-tight">
                {student.name}
              </h2>
              <span
                className={`px-3 py-0.5 rounded-full text-xs font-bold border ${
                  student.status === 'Active'
                    ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                    : student.status === 'Completed'
                    ? 'bg-[#EEF0F8] text-[#0E113C] border-[#0E113C]/20'
                    : 'bg-[#FFF8EB] text-[#E0910E] border-[#FBA920]/30'
                }`}
              >
                {student.status || 'Active'}
              </span>
            </div>

            {/* Compact Shaded Badges for APP NO, REG NO, and ENROL NO */}
            <div className="flex flex-wrap items-center gap-2 mt-2.5">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF0F8] border border-[#D5DCED] text-xs shadow-xs">
                <span className="text-[10px] font-bold text-[#5A627A] tracking-wider uppercase">APP NO:</span>
                <span className="font-mono font-bold text-[#0E113C]">{student.applicationNo || '—'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF0F8] border border-[#D5DCED] text-xs shadow-xs">
                <span className="text-[10px] font-bold text-[#5A627A] tracking-wider uppercase">REG NO:</span>
                <span className="font-mono font-bold text-[#0E113C]">{student.registrationNo || '—'}</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#EEF0F8] border border-[#D5DCED] text-xs shadow-xs">
                <span className="text-[10px] font-bold text-[#5A627A] tracking-wider uppercase">ENROL NO:</span>
                <span className="font-mono font-bold text-[#0E113C]">{student.enrolmentNo || '—'}</span>
              </span>
            </div>

            {/* Editable inline Office Code field directly underneath badges */}
            <div className="mt-2.5 flex items-center">
              {isEditingOfficeCode ? (
                <form
                  onSubmit={handleSaveOfficeCode}
                  className="inline-flex items-center gap-1.5 bg-[#F8FAFC] px-2.5 py-1 rounded-lg border border-[#0E113C]/40 shadow-xs"
                >
                  <span className="text-xs font-semibold text-[#5A627A]">Office Code:</span>
                  <input
                    type="text"
                    value={officeCodeInput}
                    onChange={(e) => setOfficeCodeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Escape') setIsEditingOfficeCode(false);
                    }}
                    placeholder="Enter Office Code"
                    className="px-2 py-0.5 text-xs font-mono font-bold text-[#0E113C] bg-white border border-[#CBD5E1] rounded focus:outline-none focus:ring-1 focus:ring-[#0E113C] w-28 sm:w-32"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="p-1 bg-[#0E113C] hover:bg-[#181C54] text-white rounded transition-colors cursor-pointer"
                    title="Save"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingOfficeCode(false)}
                    className="p-1 bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#5A627A] hover:text-[#0E113C] rounded transition-colors cursor-pointer"
                    title="Cancel"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <div className="inline-flex items-center gap-1.5 text-xs">
                  <span className="text-[#5A627A] font-medium">Office Code:</span>
                  <button
                    type="button"
                    onClick={() => {
                      setOfficeCodeInput(student.officeCode || 'KL11-CLT-01');
                      setIsEditingOfficeCode(true);
                    }}
                    className="inline-flex items-center px-2 py-0.5 rounded bg-[#F8FAFC] hover:bg-[#EEF0F8] border border-[#E2E8F0] hover:border-[#CBD5E1] font-mono font-bold text-[#0E113C] transition-all cursor-pointer"
                    title="Click to edit Office Code"
                  >
                    <span>{student.officeCode || 'KL11-CLT-01'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] text-[#0E113C] rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>

          <button
            onClick={() => setIsAddPaymentOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] rounded-xl text-xs font-bold shadow-md shadow-[#FBA920]/25 transition-all cursor-pointer"
          >
            <WalletCards className="w-4 h-4 text-[#0E113C]" />
            <span>Record Payment</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs (6 Clean Tabs in exact order) */}
      <div className="grid grid-cols-6 border-b border-[#E2E8F0] w-full bg-white">
        {[
          { id: 'overview', label: 'Overview', icon: User },
          { id: 'course_details', label: 'Course Details', icon: BookOpen },
          { id: 'fees', label: 'Fees', icon: IndianRupee },
          { id: 'car_records', label: 'Records', icon: Car },
          { id: 'bike_records', label: 'Records', icon: Bike },
          { id: 'tests', label: 'Test History', icon: Award },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive =
            activeTab === tab.id ||
            (tab.id === 'course_details' && (activeTab === 'licence' || activeTab === 'documents'));
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 py-3 px-1 sm:px-2 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer select-none min-w-0 ${
                isActive
                  ? 'border-[#0E113C] text-[#0E113C] font-extrabold bg-[#0E113C]/[0.02]'
                  : 'border-transparent text-[#5A627A] hover:text-[#0E113C] hover:border-[#CBD5E1]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${isActive ? 'text-[#0E113C]' : 'text-[#5A627A]'}`} />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ==================== TAB 1: OVERVIEW ==================== */}
      {activeTab === 'overview' && (
        <div className="w-full">
          {/* Single full-width horizontal card: Personal Information */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0] mb-6">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#0E113C]" />
                <h3 className="text-xs font-bold text-[#0E113C] uppercase tracking-wider">
                  Personal Information
                </h3>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
              {/* Row 1 (3 equal columns): Student Name (left), Guardian Name (center), Student Status (right) */}
              <div className="min-w-0">
                <span className="text-[#5A627A]">Student Name:</span>
                <p className="font-bold text-[#0E113C] text-sm mt-1 break-words overflow-hidden">{student.name}</p>
              </div>

              <div className="min-w-0">
                <span className="text-[#5A627A]">Guardian Name:</span>
                <p className="font-bold text-[#0E113C] mt-1 break-words overflow-hidden">{student.guardianName || '—'}</p>
              </div>

              <div className="min-w-0">
                <span className="text-[#5A627A]">Student Status:</span>
                <div className="mt-1">
                  <span
                    className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold border break-words overflow-hidden ${
                      student.status === 'Active'
                        ? 'bg-emerald-50 text-[#16A34A] border-emerald-200'
                        : student.status === 'Completed'
                        ? 'bg-[#EEF0F8] text-[#0E113C] border-[#0E113C]/20'
                        : 'bg-[#FFF8EB] text-[#E0910E] border-[#FBA920]/30'
                    }`}
                  >
                    {student.status || 'Active'}
                  </span>
                </div>
              </div>

              {/* Row 2 (3 equal columns): Date of Birth (DOB) (left), Mobile Number 1 (center), Mobile Number 2 (right) */}
              <div className="min-w-0">
                <span className="text-[#5A627A]">Date of Birth (DOB):</span>
                <p className="font-semibold text-[#0E113C] mt-1 break-words overflow-hidden">{student.dob || '—'}</p>
              </div>

              <div className="min-w-0">
                <span className="text-[#5A627A]">Mobile Number 1:</span>
                <p className="font-mono font-bold text-[#0E113C] text-sm mt-1 break-words overflow-hidden">{student.phone1 || '—'}</p>
              </div>

              <div className="min-w-0">
                <span className="text-[#5A627A]">Mobile Number 2:</span>
                <p className="font-mono font-medium text-[#0E113C] mt-1 break-words overflow-hidden">{student.phone2 || '—'}</p>
              </div>

              {/* Row 3 (full-width single row spanning all 3 columns, col-span-3): Complete Residential Address directly underneath Row 2 */}
              <div className="col-span-3 min-w-0">
                <span className="text-[#5A627A]">Complete Residential Address:</span>
                <p className="font-semibold text-[#0E113C] mt-1 leading-relaxed break-words overflow-hidden">{student.address || '—'}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 2: COURSE DETAILS ==================== */}
      {(activeTab === 'course_details' || activeTab === 'licence' || activeTab === 'documents') && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                  Course & Licence Details
                </h3>
                <p className="text-xs text-[#5A627A]">
                  Selected vehicle categories, LL number, LL date, DL date, course starting date and course fees
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(true)}
                className="px-3.5 py-1.5 bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] rounded-xl text-xs font-bold transition-colors cursor-pointer"
              >
                Update Licence Info
              </button>
            </div>

            {/* Selected Vehicle Categories (Only LMV & M/C supported) */}
            <div>
              <h4 className="text-xs font-bold text-[#0E113C] uppercase tracking-wider mb-2">
                Selected Vehicle Categories
              </h4>
              <div className="flex flex-wrap gap-2.5">
                {(student.vehicleCategories || [student.classOfMode?.includes('2') ? 'M/C' : 'LMV']).map((cat) => (
                  <div
                    key={cat}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#0E113C] text-white text-xs font-bold shadow-sm"
                  >
                    <ShieldCheck className="w-4 h-4 text-[#FBA920]" />
                    <span>
                      {cat === 'LMV'
                        ? '1. LMV – Light Motor Vehicle (Car)'
                        : cat === 'M/C'
                        ? '2. M/C – Motorcycle (2-Wheeler)'
                        : cat}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Cards for LL Number, LL Date, DL Date, Course Starting Date, Course Fees */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              <div className="p-4 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0]">
                <span className="text-xs text-[#5A627A]">LL Number (Learner's Licence)</span>
                <p className="text-base font-extrabold text-[#0E113C] font-mono mt-1">
                  {student.llNo || 'KL11/2026/0014285'}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Learner's Licence registry</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0]">
                <span className="text-xs text-[#5A627A]">LL Date</span>
                <p className="text-base font-extrabold text-[#0E113C] mt-1">
                  {student.llDate || '2026-02-15'}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Issue date of learner licence</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0]">
                <span className="text-xs text-[#5A627A]">DL Date</span>
                <p className="text-base font-extrabold text-[#0E113C] mt-1">
                  {student.testDate || student.dlDate || student.drivingTestDate || 'Not scheduled'}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Driving licence test date</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0]">
                <span className="text-xs text-[#5A627A]">Course Starting Date</span>
                <p className="text-base font-extrabold text-[#0E113C] mt-1">
                  {student.startDate || '—'}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Training commencement</p>
              </div>

              <div className="p-4 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0]">
                <span className="text-xs text-[#5A627A]">Regular Course Fees</span>
                <p className="text-base font-extrabold text-[#0E113C] mt-1">
                  ₹{parseFloat(student.courseFees || 0).toLocaleString('en-IN')}
                </p>
                <p className="text-[11px] text-[#94A3B8] mt-0.5">Base course tuition</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0] space-y-1">
              <span className="text-xs font-bold text-[#0E113C]">Licence Additional Notes:</span>
              <p className="text-xs text-[#5A627A] italic">
                {student.licenceNotes || 'Learner licence verified and valid. Scheduled for practical track modules.'}
              </p>
            </div>
          </div>

          {/* Official Trainee Documents & Certificates Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                  Official Trainee Documents & Certificates
                </h3>
                <p className="text-xs text-[#5A627A]">
                  Identity proofs, Learner's Licence copies, and medical fitness certificates
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(!student.documents || student.documents.length === 0) ? (
                <div className="col-span-2 py-8 text-center text-xs text-[#94A3B8]">
                  No documents uploaded for this student.
                </div>
              ) : (
                student.documents.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 rounded-xl border border-[#E2E8F0] bg-[#F6F8FB] hover:bg-[#EEF0F8] transition-colors flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-lg bg-white border border-[#E2E8F0] text-[#0E113C]">
                        <FileCheck className="w-5 h-5 text-[#0E113C]" />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-[#0E113C]">{doc.name}</h4>
                        <p className="text-[11px] text-[#5A627A]">
                          {doc.type || 'PDF'} • {doc.size || '1 MB'} • Uploaded: {doc.uploadDate || student.startDate}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => alert(`Simulated downloading ${doc.name}`)}
                      className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-[#0E113C] hover:bg-[#FBA920] transition-colors cursor-pointer"
                      title="Download document"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 3: FEES (NEW TAB) ==================== */}
      {activeTab === 'fees' && (
        <div className="space-y-6">
          {/* Clean Fee Summary Section matching Deep Navy (#0E113C) & Golden Amber (#FBA920) theme */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#E2E8F0] shadow-dd-card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0] mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#0E113C] flex items-center justify-center text-[#FBA920] shadow-sm shrink-0">
                  <IndianRupee className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#0E113C] uppercase tracking-wider">
                    Fee & Financial Summary
                  </h3>
                  <p className="text-xs text-[#5A627A]">
                    Tuition fees, additional bike charges, and outstanding balance summary
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddPaymentOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] rounded-xl text-xs font-extrabold shadow-md shadow-[#FBA920]/25 transition-all cursor-pointer self-start sm:self-auto"
              >
                <Plus className="w-4 h-4 text-[#0E113C]" />
                <span>Record Payment</span>
              </button>
            </div>

            {/* 5-Card Fee Summary Metric Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3 max-w-5xl">
              {/* 1. Regular Course Fees */}
              <div className="p-3 rounded-xl bg-[#F6F8FB] border border-[#E2E8F0] hover:border-[#0E113C]/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] sm:text-xs font-bold text-[#5A627A]">Regular Course Fees</span>
                    <BookOpen className="w-3.5 h-3.5 text-[#0E113C]/40 shrink-0" />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-[#0E113C] font-mono mt-1">
                    ₹{financials.regularCourseFees.toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="text-[11px] text-[#5A627A] mt-1 font-medium">
                  Base tuition fees
                </p>
              </div>

              {/* 2. Additional Bike Class Charges */}
              <div className="p-3 rounded-xl bg-[#FFF8EB] border border-[#FBA920]/30 hover:border-[#FBA920] transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] sm:text-xs font-bold text-[#B45309]">Bike Class Charges</span>
                    <Bike className="w-3.5 h-3.5 text-[#FBA920] shrink-0" />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-[#B45309] font-mono mt-1">
                    ₹{financials.additionalBikeCharges.toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="text-[11px] text-[#B45309]/80 mt-1 font-medium">
                  {financials.additionalBikeClassesCount} {financials.additionalBikeClassesCount === 1 ? 'class' : 'classes'} × ₹300
                </p>
              </div>

              {/* 3. Total Payable (Deep Navy #0E113C background with Golden Amber #FBA920 highlight) */}
              <div className="p-3 rounded-xl bg-[#0E113C] text-white border-2 border-[#0E113C] shadow-md shadow-[#0E113C]/20 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] sm:text-xs font-extrabold text-[#FBA920] tracking-wide uppercase">Total Payable</span>
                    <Wallet className="w-3.5 h-3.5 text-[#FBA920] shrink-0" />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-[#FBA920] font-mono mt-1">
                    ₹{financials.totalPayable.toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="text-[11px] text-gray-300 mt-1 font-medium">
                  Course + Bike charges
                </p>
              </div>

              {/* 4. Total Paid */}
              <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-200 hover:border-emerald-300 transition-all flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-800">Total Paid</span>
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  </div>
                  <p className="text-lg sm:text-xl font-black text-emerald-700 font-mono mt-1">
                    ₹{financials.totalPaid.toLocaleString('en-IN')}
                  </p>
                </div>
                <p className="text-[11px] text-emerald-700/80 mt-1 font-medium">
                  {financials.totalPayable > 0
                    ? `${Math.min(100, Math.round((financials.totalPaid / financials.totalPayable) * 100))}% settled`
                    : '100% settled'}
                </p>
              </div>

              {/* 5. Pending Balance */}
              <div
                className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                  financials.pendingBalance > 0
                    ? 'bg-red-50/50 border-red-200 hover:border-red-300'
                    : 'bg-emerald-50/40 border-emerald-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1">
                    <span
                      className={`text-[11px] sm:text-xs font-bold ${
                        financials.pendingBalance > 0 ? 'text-red-800' : 'text-emerald-800'
                      }`}
                    >
                      Pending Balance
                    </span>
                    {financials.pendingBalance > 0 ? (
                      <AlertCircle className="w-3.5 h-3.5 text-red-500 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    )}
                  </div>
                  <p
                    className={`text-lg sm:text-xl font-black font-mono mt-1 ${
                      financials.pendingBalance > 0 ? 'text-[#DC2626]' : 'text-emerald-700'
                    }`}
                  >
                    ₹{financials.pendingBalance.toLocaleString('en-IN')}
                  </p>
                </div>
                <p
                  className={`text-[11px] mt-1 font-medium ${
                    financials.pendingBalance > 0 ? 'text-red-700/80' : 'text-emerald-700/80'
                  }`}
                >
                  {financials.pendingBalance === 0
                    ? 'All dues cleared ✓'
                    : financials.pendingBike > 0
                    ? `Course: ₹${financials.pendingRegular} | Bike: ₹${financials.pendingBike}`
                    : 'Balance due'}
                </p>
              </div>
            </div>
          </div>

          {/* Student's Payment Transaction History Table */}
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#E2E8F0] shadow-dd-card space-y-4">
            <div className="pb-3 border-b border-[#E2E8F0]">
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                Payment Transaction History
              </h3>
              <p className="text-xs text-[#5A627A]">
                Individual fee payments categorized into Regular Course and Additional Bike Sessions
              </p>
            </div>

            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#EEF0F8] text-[#0E113C] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-4">Receipt ID</th>
                    <th className="py-3 px-4">Payment Date</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4 text-right">Amount Paid</th>
                    <th className="py-3 px-4">Payment Method</th>
                    <th className="py-3 px-4">Notes</th>
                    <th className="py-3 px-4 text-right">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {studentPayments.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-xs text-[#94A3B8]">
                        No payment transactions recorded for this student yet. Click "Record Payment" to log a payment.
                      </td>
                    </tr>
                  ) : (
                    studentPayments.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F6F8FB] transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#0E113C]">
                          {p.id}
                        </td>
                        <td className="py-3 px-4 font-mono text-[#5A627A]">
                          {p.paymentDate}
                        </td>
                        <td className="py-3 px-4">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${
                              p.paymentCategory === 'Additional Bike Class Fees'
                                ? 'bg-[#FFF8EB] text-[#E0910E] border-[#FBA920]/30'
                                : 'bg-[#EEF0F8] text-[#0E113C] border-[#0E113C]/20'
                            }`}
                          >
                            {p.paymentCategory || 'Regular Course Fees'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-right font-black text-emerald-700">
                          ₹{parseFloat(p.amountPaid || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="py-3 px-4 font-medium text-[#0E113C]">
                          <div className="font-bold">{p.paymentMethod || p.paymentMode || 'Cash'}</div>
                          {p.bankingName && (
                            <div className="text-[11px] text-[#5A627A] font-normal">
                              Bank: <span className="font-semibold">{p.bankingName}</span>
                            </div>
                          )}
                        </td>
                        <td className="py-3 px-4 text-xs text-[#5A627A]">
                          {p.notes || '—'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setReceiptToPrint(p)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] rounded-lg text-xs font-bold text-[#0E113C] transition-colors cursor-pointer"
                            title="Print payment receipt"
                          >
                            <Printer className="w-3.5 h-3.5 text-[#0E113C]" />
                            <span>Print</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ==================== TAB 4: CAR DRIVING RECORDS (SECTION 4) ==================== */}
      {activeTab === 'car_records' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                Car Driving Practice Records (LMV)
              </h3>
              <p className="text-xs text-[#5A627A]">
                Total Practice Entries: <strong className="text-[#0E113C]">{studentDrivingRecords.length}</strong> | Total KM Travelled: <strong className="text-[#0E113C]">{totalCarKm.toFixed(1)} KM</strong>
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search records..."
                  value={carSearch}
                  onChange={(e) => setCarSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                />
              </div>
              <button
                onClick={() => setIsAddDrivingOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] rounded-xl text-xs font-bold shadow-md shadow-[#FBA920]/25 transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Add Car Record</span>
              </button>
            </div>
          </div>

          {/* Table matching physical student card */}
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-3 text-center w-14">SL NO</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-3 text-right">KM Travelled</th>
                  <th className="py-3 px-4">Class / Practice Details</th>
                  <th className="py-3 px-4">Vehicle Details</th>
                  <th className="py-3 px-4 text-center">Trainee Sign</th>
                  <th className="py-3 px-4 text-center">Instructor Sign</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredCarRecords.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-10 text-center text-xs text-[#94A3B8]">
                      No car driving records found for this student.
                    </td>
                  </tr>
                ) : (
                  filteredCarRecords.map((r, idx) => (
                    <tr key={r.id} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-[#0E113C]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0E113C]">
                        {r.date}
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#0E113C]">
                        {r.kmTravelled} KM
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0E113C]">{r.practiceDetails || r.remarks || 'Practical session'}</div>
                        <div className="text-[11px] text-[#5A627A] font-mono">{r.startTime} - {r.endTime}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0E113C]">{r.vehicleDetails || 'Maruti Suzuki Swift'}</div>
                        <div className="text-[11px] text-[#5A627A] font-mono">{r.vehicleNumber || 'KL-11-AB-1234'}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-[#16A34A] text-[11px] font-bold border border-emerald-200">
                          {r.traineeSignature ? `✓ ${r.traineeSignature}` : 'Signed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-[#0E113C]">
                        {r.instructorSignature || r.instructor || 'Rajesh K.'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingDrivingRecord(r)}
                            className="p-1.5 text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] rounded-lg transition-colors cursor-pointer"
                            title="Edit record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCarRecord(r.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 5: BIKE CLASS RECORDS (SECTION 5) ==================== */}
      {activeTab === 'bike_records' && (
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
            <div>
              <div className="flex items-center gap-2">
                <Bike className="w-4 h-4 text-[#E0910E]" />
                <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                  Bike Class Records (Separate Register)
                </h3>
              </div>
              <p className="text-xs text-[#5A627A] mt-0.5">
                Total Classes: <strong className="text-[#0E113C]">{studentBikeClasses.length}</strong> | Total Duration: <strong className="text-[#0E113C]">{totalBikeDuration} mins</strong> | Total KM: <strong className="text-[#0E113C]">{totalBikeKm.toFixed(1)} KM</strong> | Additional Rate: <strong className="text-[#E0910E]">₹300/class</strong>
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search bike classes..."
                  value={bikeSearch}
                  onChange={(e) => setBikeSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 text-xs bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                />
              </div>
              <button
                onClick={() => setIsAddBikeOpen(true)}
                className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E113C] hover:bg-[#181C54] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-[#FBA920]" />
                <span>+ Add Bike Class (+₹300)</span>
              </button>
            </div>
          </div>

          {/* Table matching the physical card columns */}
          <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3 px-3 text-center w-14">SL NO</th>
                  <th className="py-3 px-4">DATE</th>
                  <th className="py-3 px-3">FROM</th>
                  <th className="py-3 px-3">TO</th>
                  <th className="py-3 px-3 text-center">TIME IN MIN</th>
                  <th className="py-3 px-3 text-right">KM</th>
                  <th className="py-3 px-4">VEHICLE</th>
                  <th className="py-3 px-4 text-center">Signature of Trainee</th>
                  <th className="py-3 px-4 text-center">Signature of Instructor</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {filteredBikeClasses.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-10 text-center text-xs text-[#94A3B8]">
                      No bike classes recorded yet for this student.
                    </td>
                  </tr>
                ) : (
                  filteredBikeClasses.map((b, idx) => (
                    <tr key={b.id} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3 px-3 text-center font-bold text-[#0E113C]">
                        {idx + 1}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#0E113C]">
                        {b.date}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#5A627A]">
                        {b.fromTime}
                      </td>
                      <td className="py-3 px-3 font-mono text-[#5A627A]">
                        {b.toTime}
                      </td>
                      <td className="py-3 px-3 text-center font-bold text-[#0E113C]">
                        {b.durationMinutes || 45} min
                      </td>
                      <td className="py-3 px-3 text-right font-extrabold text-[#0E113C]">
                        {b.kmTravelled}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-[#0E113C]">{b.vehicleDetails || 'Hero Splendor Plus'}</div>
                        <div className="text-[11px] text-[#5A627A] font-mono">{b.vehicleNumber || 'KL-11-BK-1102'}</div>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="inline-block px-2 py-0.5 rounded bg-emerald-50 text-[#16A34A] text-[11px] font-bold border border-emerald-200">
                          {b.traineeSignature ? `✓ ${b.traineeSignature}` : 'Signed'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-medium text-[#0E113C]">
                        {b.instructorSignature || b.instructor || 'Manoj P.'}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingBikeClass(b)}
                            className="p-1.5 text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] rounded-lg transition-colors cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBikeClass(b.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ==================== TAB 6: LICENCE TEST & RETEST HISTORY ==================== */}
      {activeTab === 'tests' && (
        <div className="space-y-6">
          {/* Top Category-wise Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card A: Learner's Licence (LL) Test */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-dd-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#0E113C]" />
                    <h4 className="text-xs font-extrabold uppercase text-[#0E113C]">
                      Learner's Licence (LL) Test
                    </h4>
                  </div>
                  {latestLL && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                        latestLL.result === 'Passed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : latestLL.result === 'Failed'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {latestLL.result}
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[#5A627A]">Original Test Date:</span>
                    <p className="font-mono font-bold text-[#0E113C]">
                      {llTests[0]?.testDate || student.llDate || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#5A627A]">Total LL Attempts:</span>
                    <p className="font-bold text-[#0E113C]">
                      {llTests.length} attempt(s)
                    </p>
                  </div>
                  {latestLL?.retestDate && (
                    <div>
                      <span className="text-[#5A627A]">Scheduled Retest:</span>
                      <p className="font-mono font-bold text-amber-900">
                        {latestLL.retestDate} ({latestLL.retestStatus})
                      </p>
                    </div>
                  )}
                  {latestLL?.remarks && (
                    <div className="text-[11px] text-[#5A627A] italic">
                      {latestLL.remarks}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                {latestLL ? (
                  <>
                    {(latestLL.result === 'Pending' || latestLL.result === 'Overdue') && (
                      <button
                        onClick={() => setUpdatingTest(latestLL)}
                        className="px-3 py-1.5 bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Update Result
                      </button>
                    )}
                    {latestLL.result === 'Failed' && (
                      <button
                        onClick={() => setRetestingTest(latestLL)}
                        className="px-3 py-1.5 bg-[#0E113C] text-white hover:bg-[#181C54] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Schedule Retest
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => openScheduleModal('LL', 'LMV')}
                    className="w-full py-2 bg-[#0E113C] text-white hover:bg-[#181C54] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Schedule LL Test
                  </button>
                )}
              </div>
            </div>

            {/* Card B: Driving Licence (DL) Test – LMV */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-dd-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-[#0E113C]" />
                    <h4 className="text-xs font-extrabold uppercase text-[#0E113C]">
                      DL Test — LMV (Car)
                    </h4>
                  </div>
                  {latestDLLmv && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                        latestDLLmv.result === 'Passed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : latestDLLmv.result === 'Failed'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {latestDLLmv.result}
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[#5A627A]">Original Test Date:</span>
                    <p className="font-mono font-bold text-[#0E113C]">
                      {dlLmvTests[0]?.testDate || student.testDate || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#5A627A]">Total LMV Attempts:</span>
                    <p className="font-bold text-[#0E113C]">
                      {dlLmvTests.length} attempt(s)
                    </p>
                  </div>
                  {latestDLLmv?.retestDate && (
                    <div>
                      <span className="text-[#5A627A]">Scheduled Retest:</span>
                      <p className="font-mono font-bold text-amber-900">
                        {latestDLLmv.retestDate} ({latestDLLmv.retestStatus})
                      </p>
                    </div>
                  )}
                  {latestDLLmv?.remarks && (
                    <div className="text-[11px] text-[#5A627A] italic">
                      {latestDLLmv.remarks}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                {latestDLLmv ? (
                  <>
                    {(latestDLLmv.result === 'Pending' || latestDLLmv.result === 'Overdue') && (
                      <button
                        onClick={() => setUpdatingTest(latestDLLmv)}
                        className="px-3 py-1.5 bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Update Result
                      </button>
                    )}
                    {latestDLLmv.result === 'Failed' && (
                      <button
                        onClick={() => setRetestingTest(latestDLLmv)}
                        className="px-3 py-1.5 bg-[#0E113C] text-white hover:bg-[#181C54] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Schedule Retest
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => openScheduleModal('DL', 'LMV')}
                    className="w-full py-2 bg-[#0E113C] text-white hover:bg-[#181C54] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Schedule LMV Test
                  </button>
                )}
              </div>
            </div>

            {/* Card C: Driving Licence (DL) Test – M/C */}
            <div className="bg-white rounded-2xl p-5 border border-[#E2E8F0] shadow-dd-card flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-2 border-b border-[#E2E8F0]">
                  <div className="flex items-center gap-2">
                    <Bike className="w-4 h-4 text-[#0E113C]" />
                    <h4 className="text-xs font-extrabold uppercase text-[#0E113C]">
                      DL Test — M/C (Motorcycle)
                    </h4>
                  </div>
                  {latestDLMc && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-extrabold border ${
                        latestDLMc.result === 'Passed'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : latestDLMc.result === 'Failed'
                          ? 'bg-red-50 text-red-800 border-red-200'
                          : 'bg-amber-50 text-amber-800 border-amber-200'
                      }`}
                    >
                      {latestDLMc.result}
                    </span>
                  )}
                </div>

                <div className="mt-3 space-y-2 text-xs">
                  <div>
                    <span className="text-[#5A627A]">Original Test Date:</span>
                    <p className="font-mono font-bold text-[#0E113C]">
                      {dlMcTests[0]?.testDate || '—'}
                    </p>
                  </div>
                  <div>
                    <span className="text-[#5A627A]">Total M/C Attempts:</span>
                    <p className="font-bold text-[#0E113C]">
                      {dlMcTests.length} attempt(s)
                    </p>
                  </div>
                  {latestDLMc?.retestDate && (
                    <div>
                      <span className="text-[#5A627A]">Scheduled Retest:</span>
                      <p className="font-mono font-bold text-amber-900">
                        {latestDLMc.retestDate} ({latestDLMc.retestStatus})
                      </p>
                    </div>
                  )}
                  {latestDLMc?.remarks && (
                    <div className="text-[11px] text-[#5A627A] italic">
                      {latestDLMc.remarks}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-[#E2E8F0] flex items-center gap-2">
                {latestDLMc ? (
                  <>
                    {(latestDLMc.result === 'Pending' || latestDLMc.result === 'Overdue') && (
                      <button
                        onClick={() => setUpdatingTest(latestDLMc)}
                        className="px-3 py-1.5 bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Update Result
                      </button>
                    )}
                    {latestDLMc.result === 'Failed' && (
                      <button
                        onClick={() => setRetestingTest(latestDLMc)}
                        className="px-3 py-1.5 bg-[#0E113C] text-white hover:bg-[#181C54] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Schedule Retest
                      </button>
                    )}
                  </>
                ) : (
                  <button
                    onClick={() => openScheduleModal('DL', 'M/C')}
                    className="w-full py-2 bg-[#0E113C] text-white hover:bg-[#181C54] rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    + Schedule M/C Test
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Chronological Test History Table Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E2E8F0]">
              <div>
                <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                  Chronological Test & Retest History Log
                </h3>
                <p className="text-xs text-[#5A627A]">
                  Maintains all original and retest attempts without overwriting historical results
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search test history..."
                    value={testSearch}
                    onChange={(e) => setTestSearch(e.target.value)}
                    className="pl-8 pr-3 py-1.5 text-xs bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
                  />
                </div>

                <button
                  onClick={() => openScheduleModal('DL', 'LMV')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E113C] hover:bg-[#181C54] text-white rounded-xl text-xs font-bold shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FBA920]" />
                  <span>+ Schedule Test</span>
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto rounded-xl border border-[#E2E8F0]">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-[#EEF0F8] text-[#0E113C] font-extrabold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                  <tr>
                    <th className="py-3 px-3 text-center w-14">ATTEMPT</th>
                    <th className="py-3 px-3">Test Type</th>
                    <th className="py-3 px-3">Category</th>
                    <th className="py-3 px-3">Test Date</th>
                    <th className="py-3 px-3">Result</th>
                    <th className="py-3 px-4">Remarks</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] bg-white">
                  {filteredTests.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-10 text-center text-xs text-[#94A3B8]">
                        No test records logged for this student yet. Click "+ Schedule Test" to register an attempt.
                      </td>
                    </tr>
                  ) : (
                    filteredTests.map((t, idx) => {
                      const isPassed = t.result === 'Passed';
                      const isFailed = t.result === 'Failed';
                      const isPending = t.result === 'Pending';

                      return (
                        <tr key={t.id} className="hover:bg-[#F6F8FB] transition-colors">
                          <td className="py-3 px-3 text-center">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                                t.attemptType === 'Retest'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-gray-100 text-gray-800 border-gray-300'
                              }`}
                            >
                              {t.attemptType} #{t.attemptNumber || idx + 1}
                            </span>
                          </td>
                          <td className="py-3 px-3 font-bold text-[#0E113C]">
                            {t.testType === 'LL' ? "Learner's Licence (LL)" : "Driving Licence (DL)"}
                          </td>
                          <td className="py-3 px-3">
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
                          <td className="py-3 px-3 font-mono font-bold text-[#0E113C]">
                            <div>{t.testDate}</div>
                            {t.attemptType === 'Retest' && (
                              <div className="text-[11px] font-medium text-[#FBA920] font-sans leading-tight mt-0.5">
                                Retest
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                                isPassed
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : isFailed
                                  ? 'bg-red-50 text-red-800 border-red-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {isPassed && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              {isFailed && <XCircle className="w-3 h-3 text-red-600" />}
                              {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                              <span>{t.result}</span>
                            </span>
                          </td>
                          <td className="py-3 px-4 text-xs text-[#5A627A]">
                            {t.remarks || '—'}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {t.result !== 'Passed' && (
                                <button
                                  onClick={() => setUpdatingTest(t)}
                                  className="px-2 py-1 text-[11px] font-bold bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] rounded-lg transition-colors cursor-pointer"
                                  title="Update Result"
                                >
                                  Update
                                </button>
                              )}
                              <button
                                onClick={() => handleDeleteTest(t.id)}
                                className="p-1 text-red-400 hover:text-red-600 rounded cursor-pointer"
                                title="Delete attempt"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
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
        </div>
      )}

      {/* ==================== MODALS ==================== */}

      {/* 1. DIGITAL STUDENT RECORD CARD MODAL */}
      <StudentRecordCardModal
        isOpen={isRecordCardOpen}
        onClose={() => setIsRecordCardOpen(false)}
        studentId={student.id}
      />

      {/* 2. EDIT STUDENT MODAL */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={student}
      />

      {/* 3. ADD CAR RECORD MODAL */}
      <AddDrivingRecordModal
        isOpen={isAddDrivingOpen}
        onClose={() => setIsAddDrivingOpen(false)}
        preselectedStudentId={student.id}
      />

      {/* 4. EDIT CAR RECORD MODAL */}
      <EditDrivingRecordModal
        isOpen={!!editingDrivingRecord}
        onClose={() => setEditingDrivingRecord(null)}
        record={editingDrivingRecord}
      />

      {/* 5. ADD BIKE CLASS MODAL */}
      <AddBikeClassModal
        isOpen={isAddBikeOpen}
        onClose={() => setIsAddBikeOpen(false)}
        preselectedStudentId={student.id}
      />

      {/* 6. EDIT BIKE CLASS MODAL */}
      <EditBikeClassModal
        isOpen={!!editingBikeClass}
        onClose={() => setEditingBikeClass(null)}
        bikeClass={editingBikeClass}
      />

      {/* 7. RECORD PAYMENT MODAL */}
      <AddPaymentModal
        isOpen={isAddPaymentOpen}
        onClose={() => setIsAddPaymentOpen(false)}
        preselectedStudentId={student.id}
      />

      {/* 8. SCHEDULE TEST MODAL */}
      <ScheduleTestModal
        isOpen={isScheduleTestOpen}
        onClose={() => setIsScheduleTestOpen(false)}
        preselectedStudentId={student.id}
        defaultTestType={defaultScheduleType}
        defaultCategory={defaultScheduleCategory}
      />

      {/* 9. UPDATE TEST RESULT MODAL */}
      <UpdateTestResultModal
        isOpen={!!updatingTest}
        onClose={() => setUpdatingTest(null)}
        test={updatingTest}
      />

      {/* 10. SCHEDULE RETEST MODAL */}
      <ScheduleRetestModal
        isOpen={!!retestingTest}
        onClose={() => setRetestingTest(null)}
        parentTest={retestingTest}
      />

      {/* 11. PRINTABLE RECEIPT MODAL */}
      {receiptToPrint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070926]/70 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] space-y-4 animate-scale-in">
            <div className="border-b border-[#E2E8F0] pb-4 text-center">
              <h3 className="text-base font-extrabold text-[#0E113C] uppercase tracking-wider">
                {settings?.schoolName || 'Al Madeena Driving School'}
              </h3>
              <p className="text-[11px] text-[#5A627A]">{settings?.address || 'Main Branch, Calicut'}</p>
              <p className="text-[11px] text-[#5A627A]">{settings?.contactNumbers || settings?.contactNumber || '+91 98470 12345'}</p>
              <div className="mt-2 text-xs font-extrabold bg-[#0E113C] text-[#FBA920] py-1.5 rounded-lg tracking-wider">
                OFFICIAL PAYMENT RECEIPT
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-[#5A627A]">Receipt Number:</span>
                <span className="font-mono font-bold text-[#0E113C]">{receiptToPrint.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A627A]">Receipt Date:</span>
                <span className="font-semibold text-[#0E113C]">{receiptToPrint.paymentDate}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A627A]">Student Name:</span>
                <span className="font-bold text-[#0E113C]">{receiptToPrint.realName || receiptToPrint.studentName || student.name}</span>
              </div>
              {receiptToPrint.bankingName && (
                <div className="flex justify-between">
                  <span className="text-[#5A627A]">Account Holder / Bank:</span>
                  <span className="font-medium text-[#0E113C]">{receiptToPrint.bankingName}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#5A627A]">Payment Category:</span>
                <span className="font-bold text-[#0E113C]">{receiptToPrint.paymentCategory || 'Regular Course Fees'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A627A]">Payment Method:</span>
                <span className="font-bold text-[#0E113C]">{receiptToPrint.paymentMethod}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#5A627A]">Reference No:</span>
                <span className="font-mono text-[#0E113C]">{receiptToPrint.referenceNo || '—'}</span>
              </div>
              <div className="border-t border-[#E2E8F0] pt-2 flex justify-between items-center">
                <span className="font-bold text-sm text-[#0E113C]">Amount Received:</span>
                <span className="font-extrabold text-xl text-[#16A34A]">
                  ₹{parseFloat(receiptToPrint.amountPaid || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-[#5A627A] italic mt-1">
                Note: {receiptToPrint.notes || 'Course fee payment installment'}
              </p>
            </div>

            <div className="border-t border-[#E2E8F0] pt-3 flex items-center justify-between text-[11px] text-[#94A3B8]">
              <span>Authorized Signature: _________</span>
              <span>Computer Generated</span>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                onClick={() => setReceiptToPrint(null)}
                className="px-4 py-2 text-xs font-semibold text-[#0E113C] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#EEF0F8] cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                className="px-5 py-2 text-xs font-bold text-[#0E113C] bg-[#FBA920] hover:bg-[#E0910E] rounded-xl flex items-center gap-1.5 shadow-md shadow-[#FBA920]/25 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Receipt</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
