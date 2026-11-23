import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  User,
  Phone,
  FileText,
  BookOpen,
  CreditCard,
  UploadCloud,
  Check,
  ArrowLeft,
  X,
  FileCheck,
  Building2,
  ShieldCheck,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CLASS_MODES, VEHICLE_CATEGORIES } from '../data/initialData';
import CustomSelect from '../components/common/CustomSelect';

export default function AddStudent() {
  const navigate = useNavigate();
  const { addStudent, settings, students } = useApp();

  const [formData, setFormData] = useState({
    // School info
    schoolName: settings.schoolName || 'Al Madeena Driving School',
    branch: settings.branches?.[0]?.name || settings.branchLocation || 'Main Branch - Bypass Road, Calicut',
    officeCode: settings.officeCode || 'KL11-CLT-01',
    schoolRegistrationNo: settings.schoolRegistrationNo || settings.licenseNumber || 'RTO-KL-11-DS-2018-042',
    schoolContact: settings.contactNumbers || settings.contactNumber || '+91 98470 54321',

    // Personal info
    name: '',
    guardianName: '',
    dob: '',
    address: '',
    phone1: '',
    phone2: '',
    photo: '',

    // Registration info
    applicationNo: `APP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
    registrationNo: `REG-KL11-${Math.floor(1000 + Math.random() * 9000)}`,
    enrolmentNo: `ENR-${Math.floor(1000 + Math.random() * 9000)}`,
    startDate: new Date().toISOString().split('T')[0],

    // Licence info
    llNo: `KL11/2026/${Math.floor(1000000 + Math.random() * 9000000)}`,
    llDate: new Date().toISOString().split('T')[0],
    testDate: '',
    licenceNotes: '',

    // Vehicle categories
    vehicleCategories: ['LMV'],
    classOfMode: '4-Wheeler (LMV)',

    // Fees
    courseFees: 7500,
    paidAmount: 2500,
    paymentMethod: 'Cash',
    notes: '',
    documents: []
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([
    { id: 'doc-init', name: 'Aadhaar_Card_Front_Back.pdf', size: '1.2 MB', uploadDate: new Date().toISOString().split('T')[0] }
  ]);

  const totalFees = parseFloat(formData.courseFees) || 0;
  const paidAmount = parseFloat(formData.paidAmount) || 0;
  const pendingBalance = Math.max(0, totalFees - paidAmount);

  const nextStudentId = `DD-2026-${String(students.length + 1).padStart(3, '0')}`;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleBranchChange = (e) => {
    const branchName = e.target.value;
    const branchObj = settings.branches?.find((b) => b.name === branchName);
    setFormData((prev) => ({
      ...prev,
      branch: branchName,
      officeCode: branchObj?.code || prev.officeCode,
      schoolContact: branchObj?.phone || prev.schoolContact
    }));
  };

  const handleCategoryToggle = (catCode) => {
    setFormData((prev) => {
      const current = prev.vehicleCategories || [];
      const updated = current.includes(catCode)
        ? current.filter((c) => c !== catCode)
        : [...current, catCode];

      const safe = updated.length ? updated : ['LMV'];

      let suggestedFee = 7500;
      let newMode = '4-Wheeler (LMV)';
      if (safe.includes('LMV') && safe.includes('M/C')) {
        suggestedFee = 10000;
        newMode = 'Both (LMV + M/C)';
      } else if (safe.includes('M/C')) {
        suggestedFee = 4500;
        newMode = '2-Wheeler (M/C)';
      }

      return {
        ...prev,
        vehicleCategories: safe,
        classOfMode: newMode,
        courseFees: suggestedFee
      };
    });
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPhotoPreview(url);
      setFormData((prev) => ({ ...prev, photo: url }));
    }
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newDocs = files.map((f, idx) => ({
      id: `doc-up-${Date.now()}-${idx}`,
      name: f.name,
      size: `${(f.size / 1024).toFixed(1)} KB`,
      uploadDate: new Date().toISOString().split('T')[0]
    }));
    setUploadedFiles((prev) => [...prev, ...newDocs]);
  };

  const removeDoc = (docId) => {
    setUploadedFiles((prev) => prev.filter((d) => d.id !== docId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Student Name is required';
    if (!formData.phone1.trim()) newErrors.phone1 = 'Primary mobile number is required';
    if (!formData.startDate) newErrors.startDate = 'Course Starting Date is required';
    if (totalFees <= 0) newErrors.courseFees = 'Course Fees must be greater than 0';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const saved = addStudent({
      ...formData,
      courseFees: totalFees,
      paidAmount: paidAmount,
      pendingBalance: pendingBalance,
      documents: uploadedFiles,
      status: pendingBalance === 0 ? 'Completed' : 'Active'
    });

    navigate(`/students/${saved.id}`);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/students')}
            className="p-2 rounded-xl bg-white border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#0E113C]">
              New Student Registration
            </h2>
            <p className="text-xs sm:text-sm text-[#5A627A]">
              Fill out physical student record card details to digitally enroll trainee
            </p>
          </div>
        </div>

        <Link
          to="/students"
          className="text-xs font-bold text-[#5A627A] hover:text-[#0E113C] underline"
        >
          Cancel and return
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* SECTION A: Driving School Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <Building2 className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                A. Driving School Information
              </h3>
              <p className="text-xs text-[#5A627A]">
                Official driving school branch location & registration identifiers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Driving School Name
              </label>
              <input
                type="text"
                name="schoolName"
                value={formData.schoolName}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] text-[#0E113C] font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Branch / Office Location *
              </label>
              <CustomSelect
                value={formData.branch}
                onChange={handleBranchChange}
                options={
                  settings.branches?.map((b) => ({
                    value: b.name,
                    label: b.name,
                    subtext: b.code
                  })) || [
                    { value: 'Main Branch - Bypass Road, Calicut', label: 'Main Branch - Bypass Road, Calicut' },
                    { value: 'City Office - Mavoor Road, Calicut', label: 'City Office - Mavoor Road, Calicut' },
                    { value: 'Feroke Sub-Branch, Calicut', label: 'Feroke Sub-Branch, Calicut' }
                  ]
                }
                className="py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Office Code
              </label>
              <input
                type="text"
                name="officeCode"
                value={formData.officeCode}
                onChange={handleChange}
                placeholder="KL11-CLT-01"
                className="w-full px-3.5 py-2.5 text-xs bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] text-[#0E113C] font-mono"
              />
            </div>
          </div>
        </div>

        {/* SECTION B: Personal Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <User className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                B. Personal Information
              </h3>
              <p className="text-xs text-[#5A627A]">
                Trainee student name, guardian, address, and contact numbers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Trainee / Student Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full official trainee name"
                className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border ${
                  errors.name ? 'border-red-500' : 'border-[#E2E8F0]'
                } text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-semibold`}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Guardian Name
              </label>
              <input
                type="text"
                name="guardianName"
                value={formData.guardianName}
                onChange={handleChange}
                placeholder="Father / Husband / Guardian"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Mobile Number 1 (Primary) *
              </label>
              <input
                type="tel"
                name="phone1"
                value={formData.phone1}
                onChange={handleChange}
                placeholder="+91 98470 12345"
                className={`w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border ${
                  errors.phone1 ? 'border-red-500' : 'border-[#E2E8F0]'
                } text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono`}
              />
              {errors.phone1 && <p className="text-[11px] text-red-500 mt-1">{errors.phone1}</p>}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Mobile Number 2 (Alternate)
              </label>
              <input
                type="tel"
                name="phone2"
                value={formData.phone2}
                onChange={handleChange}
                placeholder="+91 94471 67890"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Complete Address
              </label>
              <textarea
                rows={2}
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Complete postal address as shown on physical student card"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] resize-none"
              />
            </div>

            {/* Photo upload */}
            <div className="sm:col-span-3 pt-2">
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Student Photo
              </label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-18 rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#F6F8FB] flex items-center justify-center overflow-hidden shrink-0">
                  {photoPreview ? (
                    <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-[#94A3B8]" />
                  )}
                </div>
                <div>
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#EEF0F8] hover:bg-[#E2E8F0] text-[#0E113C] text-xs font-bold rounded-xl cursor-pointer transition-colors">
                    <UploadCloud className="w-3.5 h-3.5" />
                    <span>Upload Trainee Photo</span>
                    <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                  </label>
                  <p className="text-[11px] text-[#5A627A] mt-1">
                    Standard passport style photograph for physical record card
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION C: Registration Information */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <FileText className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                C. Registration Information
              </h3>
              <p className="text-xs text-[#5A627A]">
                Official identifiers matching the physical student registration card
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Student ID (System Assigned)
              </label>
              <input
                type="text"
                readOnly
                value={nextStudentId}
                className="w-full px-3.5 py-2.5 text-xs bg-[#EEF0F8] rounded-xl border border-[#E2E8F0] text-[#0E113C] font-mono font-bold cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Application Number (APP NO)
              </label>
              <input
                type="text"
                name="applicationNo"
                value={formData.applicationNo}
                onChange={handleChange}
                placeholder="APP-2026-1042"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Registration Number (REG NO)
              </label>
              <input
                type="text"
                name="registrationNo"
                value={formData.registrationNo}
                onChange={handleChange}
                placeholder="REG-KL11-8921"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Enrolment Number
              </label>
              <input
                type="text"
                name="enrolmentNo"
                value={formData.enrolmentNo}
                onChange={handleChange}
                placeholder="ENR-0941"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Joining Date (Course Start) *
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-semibold"
                required
              />
            </div>
          </div>
        </div>

        {/* SECTION D: Licence Details */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <ShieldCheck className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                D. Licence Information
              </h3>
              <p className="text-xs text-[#5A627A]">
                Learner's Licence details, issue date, and road test schedule
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                LL Number (Learner's Licence)
              </label>
              <input
                type="text"
                name="llNo"
                value={formData.llNo}
                onChange={handleChange}
                placeholder="KL11/2026/0014285"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                LL Date (Issue Date)
              </label>
              <input
                type="date"
                name="llDate"
                value={formData.llDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Driving Test Date
              </label>
              <input
                type="date"
                name="testDate"
                value={formData.testDate}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
              />
            </div>

            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Licence Additional Notes
              </label>
              <input
                type="text"
                name="licenceNotes"
                value={formData.licenceNotes}
                onChange={handleChange}
                placeholder="e.g. LL Form 2 submitted; eye test cleared; RTO ground slot assigned"
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920]"
              />
            </div>
          </div>
        </div>

        {/* SECTION E: Vehicle / Course Categories */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <BookOpen className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                E. Vehicle / Course Categories
              </h3>
              <p className="text-xs text-[#5A627A]">
                Select all vehicle training categories applicable to this trainee
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {[
              { id: 'LMV', label: '1. LMV – Light Motor Vehicle', code: 'LMV', desc: 'Car, Jeep, Small Van (Manual/Auto)' },
              { id: 'MC', label: '2. M/C – Motorcycle', code: 'M/C', desc: 'Two-Wheeler (Gear / Scooter)' }
            ].map((cat) => {
              const isSelected = (formData.vehicleCategories || []).includes(cat.code);
              return (
                <div
                  key={cat.id}
                  onClick={() => handleCategoryToggle(cat.code)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    isSelected
                      ? 'border-[#0E113C] bg-[#0E113C] text-white shadow-md'
                      : 'border-[#E2E8F0] bg-[#F6F8FB] text-[#0E113C] hover:bg-[#EEF0F8]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-black tracking-wide">{cat.label}</span>
                    <span
                      className={`w-5 h-5 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-[#FBA920] text-[#0E113C]' : 'border border-[#94A3B8]'
                      }`}
                    >
                      {isSelected ? '✓' : ''}
                    </span>
                  </div>
                  <p className={`text-[11px] ${isSelected ? 'text-gray-300' : 'text-[#5A627A]'}`}>
                    {cat.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-[#5A627A]">Selected Categories Classification:</span>
            <span className="font-extrabold text-[#0E113C]">{formData.classOfMode}</span>
          </div>
        </div>

        {/* SECTION F: Course Fees & Payment */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <CreditCard className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                F. Course Fees & Initial Enrollment Payment
              </h3>
              <p className="text-xs text-[#5A627A]">
                Tuition fee structure, advance paid, and starting payment balance
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Total Course Fees (₹) *
              </label>
              <input
                type="number"
                name="courseFees"
                value={formData.courseFees}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-black"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Initial Advance Paid (₹)
              </label>
              <input
                type="number"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleChange}
                className="w-full px-3.5 py-2.5 text-xs bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Payment Method
              </label>
              <CustomSelect
                value={formData.paymentMethod}
                onChange={(e) => setFormData((p) => ({ ...p, paymentMethod: e.target.value }))}
                options={['Cash', 'UPI', 'Bank Transfer', 'Card']}
                className="py-2.5"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0E113C] mb-1.5">
                Starting Pending Balance
              </label>
              <div className="px-3.5 py-2.5 text-xs bg-[#F6F8FB] rounded-xl border border-[#E2E8F0] font-black text-red-600">
                ₹{pendingBalance.toLocaleString('en-IN')}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION G: Documents */}
        <div className="bg-white rounded-2xl p-6 sm:p-7 border border-[#E2E8F0] shadow-dd-card space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#E2E8F0]">
            <div className="p-2 rounded-xl bg-[#0E113C] text-[#FBA920]">
              <FileCheck className="w-4 h-4 text-[#FBA920]" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0E113C] uppercase tracking-wider">
                G. Supporting Documents
              </h3>
              <p className="text-xs text-[#5A627A]">
                Attach Aadhaar verification, medical certificate Form 1A, or LL document
              </p>
            </div>
          </div>

          <div className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-5 text-center bg-[#F6F8FB]">
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-[#0E113C] text-[#FBA920] rounded-xl text-xs font-bold cursor-pointer hover:bg-[#181C54] transition-colors">
              <UploadCloud className="w-4 h-4 text-[#FBA920]" />
              <span>Upload Document Files</span>
              <input type="file" multiple onChange={handleFileUpload} className="hidden" />
            </label>
            <p className="text-[11px] text-[#5A627A] mt-2">
              Supports PDF, PNG, JPG (Aadhaar, Medical Form 1A, Learner's Licence copy)
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div className="space-y-2">
              {uploadedFiles.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between p-2.5 bg-white rounded-xl border border-[#E2E8F0] text-xs"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#0E113C]" />
                    <span className="font-semibold text-[#0E113C]">{doc.name}</span>
                    <span className="text-[10px] text-[#5A627A]">({doc.size})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDoc(doc.id)}
                    className="text-red-500 hover:text-red-700 font-bold p-1 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bottom Submission Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E2E8F0]">
          <button
            type="button"
            onClick={() => navigate('/students')}
            className="px-5 py-2.5 rounded-xl border border-[#E2E8F0] text-xs font-bold text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#FBA920] hover:bg-[#E0910E] text-[#0E113C] text-xs font-black rounded-xl shadow-md shadow-[#FBA920]/25 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
          >
            <Check className="w-4 h-4 text-[#0E113C]" />
            <span>Complete & Register Student</span>
          </button>
        </div>
      </form>
    </div>
  );
}
