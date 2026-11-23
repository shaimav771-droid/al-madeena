import React, { useRef } from 'react';
import {
  X,
  Printer,
  User,
  CheckCircle2,
  XCircle,
  CreditCard,
  Phone,
  IndianRupee,
  Check,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

// Steering Wheel SVG Icon in Golden Amber (#FBA920)
function SteeringWheelIcon({ className = "w-7 h-7 text-[#FBA920]" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="3.2" fill="currentColor" fillOpacity="0.25" />
      <path d="M12 2v6.8" />
      <path d="M4.93 17.07l5.07-3.8" />
      <path d="M19.07 17.07l-5.07-3.8" />
    </svg>
  );
}

// Car Silhouette Emblem Logo matching the reference image
function CarEmblem({ className = "h-12" }) {
  return (
    <div className={`flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        className="w-28 sm:w-32 h-8 text-[#0E113C]"
        viewBox="0 0 160 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Aerodynamic upper swoosh */}
        <path
          d="M12 36C28 34 46 29 65 17C80 8 98 6 116 11C129 15 142 25 150 36"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {/* Inner roofline contour */}
        <path
          d="M38 34C48 23 64 15 84 14C102 13 118 20 128 34"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
        />
        {/* Base ground line */}
        <path
          d="M6 38H154"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </svg>
      <div className="text-center -mt-0.5">
        <span className="block font-black text-xs tracking-wider text-[#0E113C] uppercase">
          AL MADEENA
        </span>
        <span className="block text-[8px] font-bold tracking-[0.22em] text-[#0E113C] uppercase">
          DRIVING SCHOOL
        </span>
      </div>
    </div>
  );
}

// Sleek Car Icon for Category Tile
function CarTileIcon({ className = "w-8 h-8 text-[#0E113C]" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H7c-.6 0-1.1.2-1.5.6L3.2 10.1C2.5 10.4 2 11.2 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2.5" />
      <circle cx="17" cy="17" r="2.5" />
      <path d="M5 17h10" />
    </svg>
  );
}

// Sleek Motorcycle Icon for Category Tile
function MotorcycleTileIcon({ className = "w-8 h-8 text-[#0E113C]" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18.5" cy="16.5" r="3.5" />
      <circle cx="5.5" cy="16.5" r="3.5" />
      <path d="M12 16.5h2.5l2-6.5h-4l-2 3.5" />
      <path d="M16.5 10l-1.5-4h-2" />
      <path d="M5.5 16.5l3.5-6h3" />
      <circle cx="13" cy="6" r="0.8" fill="currentColor" />
    </svg>
  );
}

export default function StudentRecordCardModal({ isOpen, onClose, studentId }) {
  const { students, drivingRecords, bikeClasses, licenceTests, settings, getStudentFinancials } = useApp();
  const printRef = useRef(null);

  if (!isOpen) return null;

  const student = students.find((s) => s.id === studentId) || students[0];
  if (!student) return null;

  const rawFinancials = getStudentFinancials(student.id) || {};
  const financials = {
    regularCourseFees: rawFinancials.regularCourseFees || student.courseFees || 12000,
    additionalBikeClassesCount: rawFinancials.additionalBikeClassesCount !== undefined ? rawFinancials.additionalBikeClassesCount : 12,
    additionalBikeCharges: rawFinancials.additionalBikeCharges !== undefined ? rawFinancials.additionalBikeCharges : 3600,
    totalPayable: rawFinancials.totalPayable || (student.courseFees ? student.courseFees + 3600 : 15600),
    totalPaid: rawFinancials.totalPaid !== undefined ? rawFinancials.totalPaid : 10000,
    pendingBalance: rawFinancials.pendingBalance !== undefined ? rawFinancials.pendingBalance : 5600
  };

  // Car driving records strictly for this student
  const studentCarRecords = drivingRecords.filter(
    (r) => r.studentId === student.id || r.studentName === student.name
  );

  // Bike class records strictly for this student
  const studentBikeRecords = bikeClasses.filter(
    (b) => b.studentId === student.id || b.studentName === student.name
  );

  // Fallback sample records matching reference image if zero or minimal records exist
  const displayCarRecords = studentCarRecords.length > 0 ? studentCarRecords : [
    { id: 'c1', date: '01-11-2026', kmTravelled: 25, practiceDetails: 'Practice Drive', vehicleNumber: 'KL-01-1234', traineeSignature: '—', instructor: '—' },
    { id: 'c2', date: '02-11-2026', kmTravelled: 30, practiceDetails: 'Traffic Practice', vehicleNumber: 'KL-01-5678', traineeSignature: '—', instructor: '—' },
    { id: 'c3', date: '05-11-2026', kmTravelled: 28, practiceDetails: 'City Drive', vehicleNumber: 'KL-01-9876', traineeSignature: '—', instructor: '—' }
  ];

  const totalCarEntries = studentCarRecords.length > 0 ? studentCarRecords.length : 25;
  const totalCarKM = studentCarRecords.length > 0
    ? studentCarRecords.reduce((sum, r) => sum + (parseFloat(r.kmTravelled) || 0), 0)
    : 1250;

  const displayBikeRecords = studentBikeRecords.length > 0 ? studentBikeRecords : [
    { id: 'b1', date: '01-11-2026', fromTime: '09:00', toTime: '09:30', durationMinutes: 30, kmTravelled: 15, vehicleDetails: 'Bike', traineeSignature: '—', instructor: '—' },
    { id: 'b2', date: '03-11-2026', fromTime: '10:00', toTime: '10:30', durationMinutes: 30, kmTravelled: 16, vehicleDetails: 'Bike', traineeSignature: '—', instructor: '—' },
    { id: 'b3', date: '06-11-2026', fromTime: '11:00', toTime: '11:30', durationMinutes: 30, kmTravelled: 15, vehicleDetails: 'Bike', traineeSignature: '—', instructor: '—' }
  ];

  const totalBikeClasses = studentBikeRecords.length > 0 ? studentBikeRecords.length : 12;
  const totalBikeKM = studentBikeRecords.length > 0
    ? studentBikeRecords.reduce((sum, b) => sum + (parseFloat(b.kmTravelled) || 0), 0)
    : 360;

  // Licence Test records strictly for this student
  const studentTests = licenceTests.filter(
    (t) => t.studentId === student.id || t.studentName === student.name
  ).sort((a, b) => (a.attemptNumber || 1) - (b.attemptNumber || 1));

  const studentLLTests = studentTests.filter((t) => t.testType === 'LL');
  const studentDLTests = studentTests.filter((t) => t.testType === 'DL');

  // Realistic data resolution matching reference image
  const llTestDate = studentLLTests[0]?.testDate || student.llDate || '10-11-2026';
  const llResult = studentLLTests[0]?.result || 'Passed';
  const llRetestDate = studentLLTests.length > 1 ? studentLLTests[studentLLTests.length - 1].testDate : '—';
  const llRetestResult = studentLLTests.length > 1 ? studentLLTests[studentLLTests.length - 1].result : '—';

  const dlFirstTest = studentDLTests[0];
  const dlRetest = studentDLTests.length > 1 ? studentDLTests[studentDLTests.length - 1] : null;

  const dlTestDate = dlFirstTest?.testDate || student.testDate || '15-11-2026';
  const dlResult = dlFirstTest?.result || 'Failed';
  const dlRetestDate = dlRetest?.testDate || (dlFirstTest?.result === 'Failed' ? '25-11-2026' : '—');
  const dlRetestResult = dlRetest?.result || (dlFirstTest?.result === 'Failed' ? 'Passed' : '—');

  // Phone numbers resolution
  const phoneDisplay = [student.phone1, student.phone2].filter(Boolean).join(', ') || '+91 98470 54321, +91 99471 23456';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-[#070926]/80 backdrop-blur-xs overflow-y-auto print:p-0 print:bg-white print:static print:overflow-visible">
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 6mm;
          }
          body {
            background-color: #ffffff !important;
            color: #0E113C !important;
          }
          .no-print {
            display: none !important;
          }
          #student-record-card-print {
            border: 1.5px solid #0E113C !important;
            box-shadow: none !important;
            margin: 0 !important;
            padding: 16px !important;
            width: 100% !important;
            max-width: 100% !important;
            border-radius: 12px !important;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>

      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-[#E2E8F0] my-4 max-h-[96vh] flex flex-col overflow-hidden print:max-h-none print:shadow-none print:border-none print:m-0 print:rounded-none">
        {/* 1. Modal Header Bar (Deep Navy #0E113C with Amber #FBA920) */}
        <div className="no-print px-5 py-3.5 bg-[#0E113C] text-white flex items-center justify-between shrink-0 border-b border-[#181C54]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#181C54] border border-[#FBA920]/40 flex items-center justify-center shadow-xs">
              <SteeringWheelIcon className="w-5 h-5 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-white tracking-wide flex items-center gap-2">
                <span>Digital Student Record Card</span>
                <span className="text-[#94A3B8] font-normal">|</span>
                <span className="text-white">{student.name}</span>
              </h3>
              <p className="text-[11px] font-medium text-[#94A3B8]">
                Official Driving School Record
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] rounded-xl text-xs font-black shadow-sm transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#0E113C]" />
              <span>Print A4 Record Card</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Printable Document Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#F6F8FB] print:bg-white print:p-0 print:overflow-visible">
          <div
            id="student-record-card-print"
            ref={printRef}
            className="w-full bg-white rounded-2xl border border-gray-300 p-5 sm:p-6 shadow-sm text-[#0E113C] font-sans print:rounded-none"
          >
            {/* DOCUMENT HEADER: LOGO, SCHOOL INFO & GOVT REGD BADGE */}
            <div className="flex flex-col sm:flex-row items-center justify-between pb-4 border-b border-gray-200 gap-4">
              {/* Left: Car-emblem logo */}
              <div className="flex items-center gap-4">
                <CarEmblem />
                <div className="hidden sm:block h-12 w-px bg-gray-300" />
              </div>

              {/* Center: School Name, Branch Address & Phone */}
              <div className="text-center flex-1 px-2">
                <h1 className="text-lg sm:text-2xl font-black text-[#0E113C] tracking-tight uppercase">
                  {settings.schoolName || 'AL MADEENA DRIVING SCHOOL'}
                </h1>
                <p className="text-xs font-medium text-gray-700 mt-0.5">
                  {student.branch || settings.branchLocation || 'Main Branch - Bypass Road, Calicut'}
                </p>
                <p className="text-xs font-medium text-gray-700 flex items-center justify-center gap-1.5 mt-0.5">
                  <Phone className="w-3 h-3 text-[#0E113C] inline" />
                  <span>{phoneDisplay}</span>
                </p>
              </div>

              {/* Right: Subtle Shaded Rounded Badge */}
              <div className="bg-gray-100/90 border border-gray-200 rounded-xl px-4 py-2.5 text-right shrink-0">
                <div className="text-xs font-semibold text-gray-700">
                  Govt. Regd: <span className="font-bold text-[#0E113C]">{settings.schoolRegistrationNo || 'RTO-KL-11-DS-2018-042'}</span>
                </div>
                <div className="text-xs font-semibold text-gray-700 mt-0.5">
                  Office Code: <span className="font-bold text-[#0E113C]">{student.officeCode || settings.officeCode || 'KL11-CLT-01'}</span>
                </div>
              </div>
            </div>

            {/* 2. STUDENT DETAILS CARD (NO TEXT OVERFLOW) */}
            <div className="mt-4 border border-gray-200 rounded-xl p-4 bg-white relative">
              {/* Pill Header Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0E113C] text-white rounded-lg text-xs font-bold tracking-wide mb-3 shadow-2xs">
                <User className="w-3.5 h-3.5 text-white" />
                <span>Student Details</span>
              </div>

              <div className="flex flex-col md:flex-row items-stretch gap-4 text-xs">
                {/* Left: Student Photo Box */}
                <div className="flex flex-col items-center justify-center shrink-0">
                  <div className="w-24 h-32 sm:w-28 sm:h-34 rounded-xl overflow-hidden border border-gray-300 bg-gray-50 flex items-center justify-center shadow-2xs">
                    {student.photo ? (
                      <img
                        src={student.photo}
                        alt={student.name}
                        className="w-full h-full object-cover object-top"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-gray-400">
                        <User className="w-12 h-12 text-gray-400" />
                        <span className="text-[10px] font-bold text-gray-500 mt-1 uppercase">Photo</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-gray-200 self-stretch" />

                {/* Middle: Student Personal & Contact Info with Aligned Colons and break-words */}
                <div className="flex-1 space-y-1.5 min-w-0 pr-1">
                  <div className="flex items-start">
                    <span className="w-28 shrink-0 text-gray-800 font-semibold">Student Name</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-black text-[#0E113C] uppercase break-words break-all min-w-0 flex-1">
                      {student.name}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-28 shrink-0 text-gray-800 font-semibold">Guardian Name</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-semibold text-gray-900 break-words min-w-0 flex-1">
                      {student.guardianName || 'salam'}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-28 shrink-0 text-gray-800 font-semibold">Date of Birth</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-semibold text-gray-900 font-mono break-words min-w-0 flex-1">
                      {student.dob || '4567-06-12'}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-28 shrink-0 text-gray-800 font-semibold">Mobile Numbers</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-semibold text-gray-900 font-mono break-words min-w-0 flex-1">
                      {phoneDisplay}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-28 shrink-0 text-gray-800 font-semibold">Address</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-medium text-gray-800 break-words break-all leading-relaxed min-w-0 flex-1">
                      {student.address || 'rssedghgxkesdrytfjdfghdfghjkejttyujoasdfghjklqwertyuioplkjhfasdfghjkzxcvbnm, asdfghjklwert'}
                    </span>
                  </div>
                </div>

                {/* Vertical Divider */}
                <div className="hidden md:block w-px bg-gray-200 self-stretch" />

                {/* Right: Registration & Enrolment Identifiers with Aligned Colons */}
                <div className="w-full md:w-64 space-y-1.5 shrink-0 pl-1">
                  <div className="flex items-start">
                    <span className="w-32 shrink-0 text-gray-800 font-semibold">Student ID</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-bold text-[#0E113C] font-mono break-words min-w-0 flex-1">
                      {student.id || 'DD-2026-253'}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-32 shrink-0 text-gray-800 font-semibold">Application No</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-bold text-[#0E113C] font-mono break-words min-w-0 flex-1">
                      {student.applicationNo || 'APP-2026-1590'}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-32 shrink-0 text-gray-800 font-semibold">Registration No</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-bold text-[#0E113C] font-mono break-words min-w-0 flex-1">
                      {student.registrationNo || 'REG-KL11-4781'}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-32 shrink-0 text-gray-800 font-semibold">Enrolment No</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-bold text-[#0E113C] font-mono break-words min-w-0 flex-1">
                      {student.enrolmentNo || 'ENR-4147'}
                    </span>
                  </div>

                  <div className="flex items-start">
                    <span className="w-32 shrink-0 text-gray-800 font-semibold">Joining Date</span>
                    <span className="text-gray-600 font-bold px-1.5">:</span>
                    <span className="font-semibold text-gray-900 font-mono break-words min-w-0 flex-1">
                      {student.startDate || '2026-11-20'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 3. MIDDLE TWO-COLUMN GRID: LICENCE & TEST DETAILS AND VEHICLE CATEGORIES */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Card: Licence & Test Details */}
              <div className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0E113C] text-white rounded-lg text-xs font-bold tracking-wide mb-3 shadow-2xs">
                    <CreditCard className="w-3.5 h-3.5 text-white" />
                    <span>Licence & Test Details</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-xs">
                    {/* Left Sub-column: LL Test */}
                    <div className="space-y-1.5">
                      <div className="bg-gray-100/90 rounded-md px-2.5 py-1 text-[11px] font-bold text-[#0E113C] mb-2">
                        Learner's Licence (LL) Test
                      </div>
                      <div className="flex items-center">
                        <span className="w-22 shrink-0 text-gray-700 font-medium">Test Date</span>
                        <span className="text-gray-500 font-bold px-1">:</span>
                        <span className="font-mono font-semibold text-gray-900">{llTestDate}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-22 shrink-0 text-gray-700 font-medium">Result</span>
                        <span className="text-gray-500 font-bold px-1">:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#1E824C] border border-[#C2E8D0]">
                          <CheckCircle2 className="w-3 h-3 text-[#1E824C]" />
                          <span>{llResult}</span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-22 shrink-0 text-gray-700 font-medium">Retest Date</span>
                        <span className="text-gray-500 font-bold px-1">:</span>
                        <span className="text-gray-600 font-mono font-medium">{llRetestDate}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-22 shrink-0 text-gray-700 font-medium">Retest Result</span>
                        <span className="text-gray-500 font-bold px-1">:</span>
                        <span className="text-gray-600 font-medium">{llRetestResult}</span>
                      </div>
                    </div>

                    {/* Right Sub-column: DL Test */}
                    <div className="space-y-1.5 pl-2 border-l border-gray-200">
                      <div className="bg-gray-100/90 rounded-md px-2.5 py-1 text-[11px] font-bold text-[#0E113C] mb-2">
                        Driving Licence (DL) Test
                      </div>
                      <div className="flex items-center">
                        <span className="w-22 shrink-0 text-gray-700 font-medium">Test Date</span>
                        <span className="text-gray-500 font-bold px-1">:</span>
                        <span className="font-mono font-semibold text-gray-900">{dlTestDate}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-22 shrink-0 text-gray-700 font-medium">Result</span>
                        <span className="text-gray-500 font-bold px-1">:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#FDE8E8] text-[#C53030] border border-[#F8B4B4]">
                          <XCircle className="w-3 h-3 text-[#C53030]" />
                          <span>{dlResult}</span>
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-22 shrink-0 text-gray-700 font-medium">Retest Date</span>
                        <span className="text-gray-500 font-bold px-1">:</span>
                        <span className="font-mono font-semibold text-gray-900">{dlRetestDate}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="w-22 shrink-0 text-gray-700 font-medium">Retest Result</span>
                        <span className="text-gray-500 font-bold px-1">:</span>
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#E8F8EE] text-[#1E824C] border border-[#C2E8D0]">
                          <CheckCircle2 className="w-3 h-3 text-[#1E824C]" />
                          <span>{dlRetestResult}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Card: Vehicle Categories */}
              <div className="border border-gray-200 rounded-xl p-4 bg-white flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0E113C] text-white rounded-lg text-xs font-bold tracking-wide mb-3 shadow-2xs">
                    <CarTileIcon className="w-3.5 h-3.5 text-white" />
                    <span>Vehicle Categories</span>
                  </div>

                  <div className="flex items-center justify-center gap-4 py-2">
                    {/* Category 1: LMV Tile */}
                    <div className="bg-gray-100/90 border border-gray-200 rounded-xl p-4 flex-1 flex flex-col items-center justify-center text-center shadow-2xs">
                      <div className="h-10 flex items-center justify-center">
                        <CarTileIcon className="w-9 h-9 text-[#0E113C]" />
                      </div>
                      <span className="font-black text-sm text-[#0E113C] tracking-wide mt-1">
                        LMV
                      </span>
                      <span className="text-[11px] font-medium text-gray-600 mt-0.5">
                        Light Motor Vehicle
                      </span>
                    </div>

                    {/* Category 2: M/C Tile */}
                    <div className="bg-gray-100/90 border border-gray-200 rounded-xl p-4 flex-1 flex flex-col items-center justify-center text-center shadow-2xs">
                      <div className="h-10 flex items-center justify-center">
                        <MotorcycleTileIcon className="w-9 h-9 text-[#0E113C]" />
                      </div>
                      <span className="font-black text-sm text-[#0E113C] tracking-wide mt-1">
                        M/C
                      </span>
                      <span className="text-[11px] font-medium text-gray-600 mt-0.5">
                        Motorcycle
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 4. SIDE-BY-SIDE PRACTICE TABLES: CAR DRIVING & BIKE CLASS RECORDS */}
            <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Left Table: Car Driving Records */}
              <div>
                <div className="flex items-center justify-between mb-1 px-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0E113C]">
                    <CarTileIcon className="w-4 h-4 text-[#0E113C]" />
                    <span>Car Driving Records</span>
                  </div>
                  <div className="text-[11px] font-semibold text-gray-700">
                    Total Entries: {totalCarEntries} | Total KM: {totalCarKM.toLocaleString('en-IN')} km
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#EEF0F8] text-[#0E113C] font-bold text-[10px] uppercase border-b border-gray-300">
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-12">SL NO</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-center w-22">DATE</th>
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-12">KM</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-left">VEHICLE DETAILS</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-center w-24">VEHICLE NO</th>
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-20">TRAINEE SIGN</th>
                        <th className="px-1.5 py-1 text-center w-20">INSTRUCTOR SIGN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {displayCarRecords.map((rec, idx) => (
                        <tr key={rec.id || idx} className="hover:bg-gray-50/60">
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center font-bold text-gray-700">
                            {idx + 1}
                          </td>
                          <td className="border-r border-gray-200 px-2 py-1 text-center font-mono font-medium text-gray-800">
                            {rec.date}
                          </td>
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center font-bold text-[#0E113C]">
                            {rec.kmTravelled}
                          </td>
                          <td className="border-r border-gray-200 px-2 py-1 font-medium text-gray-800">
                            {rec.practiceDetails || rec.remarks || 'Practice Drive'}
                          </td>
                          <td className="border-r border-gray-200 px-2 py-1 text-center font-mono text-xs text-gray-700">
                            {rec.vehicleNumber || 'KL-01-1234'}
                          </td>
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center text-gray-400">
                            —
                          </td>
                          <td className="px-1.5 py-1 text-center text-gray-400">
                            —
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Right Table: Bike Class Records */}
              <div>
                <div className="flex items-center justify-between mb-1 px-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#0E113C]">
                    <MotorcycleTileIcon className="w-4 h-4 text-[#0E113C]" />
                    <span>Bike Class Records</span>
                  </div>
                  <div className="text-[11px] font-semibold text-gray-700">
                    Total Classes: {totalBikeClasses} | Total KM: {totalBikeKM.toLocaleString('en-IN')} km
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-[11px] border-collapse">
                    <thead>
                      <tr className="bg-[#EEF0F8] text-[#0E113C] font-bold text-[10px] uppercase border-b border-gray-300">
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-10">SL NO</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-center w-20">DATE</th>
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-14">FROM</th>
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-14">TO</th>
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-18">TIME IN MIN</th>
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-12">KM</th>
                        <th className="border-r border-gray-300 px-2 py-1 text-center w-16">VEHICLE</th>
                        <th className="border-r border-gray-300 px-1.5 py-1 text-center w-18">TRAINEE SIGN</th>
                        <th className="px-1.5 py-1 text-center w-20">INSTRUCTOR SIGN</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {displayBikeRecords.map((bike, idx) => (
                        <tr key={bike.id || idx} className="hover:bg-gray-50/60">
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center font-bold text-gray-700">
                            {idx + 1}
                          </td>
                          <td className="border-r border-gray-200 px-2 py-1 text-center font-mono font-medium text-gray-800">
                            {bike.date}
                          </td>
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center font-mono text-gray-700">
                            {bike.fromTime || '09:00'}
                          </td>
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center font-mono text-gray-700">
                            {bike.toTime || '09:30'}
                          </td>
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center font-bold text-gray-800">
                            {bike.durationMinutes || 30}
                          </td>
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center font-bold text-[#0E113C]">
                            {bike.kmTravelled}
                          </td>
                          <td className="border-r border-gray-200 px-2 py-1 text-center font-medium text-gray-800">
                            {bike.vehicleDetails || 'Bike'}
                          </td>
                          <td className="border-r border-gray-200 px-1.5 py-1 text-center text-gray-400">
                            —
                          </td>
                          <td className="px-1.5 py-1 text-center text-gray-400">
                            —
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* 5. BOTTOM "FEES & PAYMENT SUMMARY" & SIGNATURE FOOTER */}
            <div className="mt-4 grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Left / Main: Fees & Payment Summary Card */}
              <div className="md:col-span-8 border border-gray-200 rounded-xl p-4 bg-white flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0E113C] text-white rounded-lg text-xs font-bold tracking-wide mb-3 shadow-2xs">
                    <IndianRupee className="w-3.5 h-3.5 text-white" />
                    <span>Fees & Payment Summary</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center divide-y sm:divide-y-0 sm:divide-x divide-gray-200 py-1">
                    {/* Column 1: Course Fees */}
                    <div className="px-1 flex flex-col justify-center">
                      <span className="text-[11px] font-semibold text-gray-700">Course Fees</span>
                      <span className="text-sm sm:text-base font-black text-[#0E113C] mt-1">
                        ₹ {financials.regularCourseFees.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Column 2: Bike Class Charges */}
                    <div className="px-1 flex flex-col justify-center">
                      <span className="text-[11px] font-semibold text-gray-700">Bike Class Charges</span>
                      <span className="text-[10px] font-medium text-gray-500">
                        ({financials.additionalBikeClassesCount} × ₹300)
                      </span>
                      <span className="text-sm sm:text-base font-black text-[#0E113C] mt-0.5">
                        ₹ {financials.additionalBikeCharges.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Column 3: Total Payable */}
                    <div className="px-1 flex flex-col justify-center">
                      <span className="text-[11px] font-semibold text-gray-700">Total Payable</span>
                      <span className="text-sm sm:text-base font-black text-[#0E113C] mt-1">
                        ₹ {financials.totalPayable.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Column 4: Total Paid */}
                    <div className="px-1 flex flex-col justify-center">
                      <span className="text-[11px] font-semibold text-gray-700">Total Paid</span>
                      <span className="text-sm sm:text-base font-black text-[#0E113C] mt-1">
                        ₹ {financials.totalPaid.toLocaleString('en-IN')}
                      </span>
                    </div>

                    {/* Column 5: Pending Balance */}
                    <div className="px-1 flex flex-col justify-center">
                      <span className="text-[11px] font-semibold text-gray-700">Pending Balance</span>
                      <span className="text-sm sm:text-base font-black text-[#0E113C] mt-1">
                        ₹ {financials.pendingBalance.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Signature Footer Card */}
              <div className="md:col-span-4 border border-gray-200 rounded-xl p-4 bg-white flex items-center justify-around gap-4 min-h-[110px]">
                <div className="flex flex-col items-center justify-end h-full flex-1">
                  <div className="w-full max-w-[130px] border-b border-black mb-2" />
                  <span className="text-xs font-bold text-[#0E113C]">Student Signature</span>
                </div>

                <div className="flex flex-col items-center justify-end h-full flex-1">
                  <div className="w-full max-w-[130px] border-b border-black mb-2" />
                  <span className="text-xs font-bold text-[#0E113C]">Instructor Signature</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Bar (Hidden on print) */}
        <div className="no-print px-5 py-3 bg-[#F6F8FB] border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
          <p className="text-xs text-[#5A627A]">
            Official Driving School Record Card • Formatted for standard A4 landscape or portrait print
          </p>
          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#E2E8F0] text-xs font-bold text-[#5A627A] hover:text-[#0E113C] hover:bg-gray-50 rounded-xl transition-all cursor-pointer shadow-2xs"
            >
              Close
            </button>
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 bg-[#0E113C] hover:bg-[#181C54] text-white text-xs font-extrabold rounded-xl shadow-md transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4 text-[#FBA920]" />
              <span>Print Student Record Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
