import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Clock,
  Trash2,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Award,
  Car,
  Bike,
  Edit3,
  Calendar,
  X,
  User
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import AddDrivingRecordModal from '../components/modals/AddDrivingRecordModal';
import EditDrivingRecordModal from '../components/modals/EditDrivingRecordModal';
import AddBikeClassModal from '../components/modals/AddBikeClassModal';
import EditBikeClassModal from '../components/modals/EditBikeClassModal';

export default function DrivingRecords() {
  const {
    drivingRecords,
    bikeClasses,
    students,
    deleteDrivingRecord,
    deleteBikeClass,
    stats,
    isAddCarModalOpen,
    setIsAddCarModalOpen,
    closeAddCarModal,
    isAddBikeModalOpen,
    setIsAddBikeModalOpen,
    closeAddBikeModal,
    drivingActiveTab: activeTab,
    setDrivingActiveTab: setActiveTab
  } = useApp();

  // Car Records State
  const [editingCarRecord, setEditingCarRecord] = useState(null);

  // Bike Classes State
  const [editingBikeClass, setEditingBikeClass] = useState(null);

  // Filters State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [isAutocompleteOpen, setIsAutocompleteOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Refs for click outside & date picker
  const searchContainerRef = useRef(null);
  const dateInputRef = useRef(null);

  // Close autocomplete on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsAutocompleteOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Matching students for live autocomplete
  const matchingStudents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return [];
    return students
      .filter((st) => {
        const name = (st.name || '').toLowerCase();
        const id = (st.id || '').toLowerCase();
        const phone = (st.phone || '').toLowerCase();
        return name.includes(q) || id.includes(q) || phone.includes(q);
      })
      .slice(0, 8);
  }, [students, searchQuery]);

  // Autocomplete & Search Handlers
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setSearchQuery(val);
    setSelectedStudent(null); // Return to live text mode on manual typing
    setIsAutocompleteOpen(val.trim().length > 0);
    setCurrentPage(1);
  };

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setIsAutocompleteOpen(false);
    setCurrentPage(1);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedStudent(null);
    setIsAutocompleteOpen(false);
    setCurrentPage(1);
  };

  const handleClearStudent = () => {
    setSelectedStudent(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsAutocompleteOpen(false);
    }
  };

  // Filter Car Records
  const filteredCarRecords = useMemo(() => {
    return drivingRecords.filter((rec) => {
      // Date filter
      const matchesDate =
        !selectedDate ||
        (rec.date && (rec.date === selectedDate || rec.date.startsWith(selectedDate)));

      // Student selection or text search
      let matchesSearch = true;
      if (selectedStudent) {
        matchesSearch =
          rec.studentId === selectedStudent.id ||
          (rec.studentName && rec.studentName.toLowerCase() === selectedStudent.name.toLowerCase());
      } else {
        const q = searchQuery.toLowerCase().trim();
        if (q) {
          matchesSearch =
            (rec.studentName && rec.studentName.toLowerCase().includes(q)) ||
            (rec.studentId && rec.studentId.toLowerCase().includes(q)) ||
            (rec.vehicleDetails && rec.vehicleDetails.toLowerCase().includes(q)) ||
            (rec.vehicleNumber && rec.vehicleNumber.toLowerCase().includes(q)) ||
            (rec.remarks && rec.remarks.toLowerCase().includes(q)) ||
            (rec.practiceDetails && rec.practiceDetails.toLowerCase().includes(q)) ||
            (rec.instructor && rec.instructor.toLowerCase().includes(q)) ||
            (rec.instructorSignature && rec.instructorSignature.toLowerCase().includes(q));
        }
      }

      return matchesDate && matchesSearch;
    });
  }, [drivingRecords, selectedDate, selectedStudent, searchQuery]);

  // Filter Bike Records
  const filteredBikeRecords = useMemo(() => {
    return bikeClasses.filter((b) => {
      // Date filter
      const matchesDate =
        !selectedDate ||
        (b.date && (b.date === selectedDate || b.date.startsWith(selectedDate)));

      // Student selection or text search
      let matchesSearch = true;
      if (selectedStudent) {
        matchesSearch =
          b.studentId === selectedStudent.id ||
          (b.studentName && b.studentName.toLowerCase() === selectedStudent.name.toLowerCase());
      } else {
        const q = searchQuery.toLowerCase().trim();
        if (q) {
          matchesSearch =
            (b.studentName && b.studentName.toLowerCase().includes(q)) ||
            (b.studentId && b.studentId.toLowerCase().includes(q)) ||
            (b.vehicleDetails && b.vehicleDetails.toLowerCase().includes(q)) ||
            (b.vehicleNumber && b.vehicleNumber.toLowerCase().includes(q)) ||
            (b.remarks && b.remarks.toLowerCase().includes(q)) ||
            (b.instructor && b.instructor.toLowerCase().includes(q)) ||
            (b.instructorSignature && b.instructorSignature.toLowerCase().includes(q));
        }
      }

      return matchesDate && matchesSearch;
    });
  }, [bikeClasses, selectedDate, selectedStudent, searchQuery]);

  const activeRecords = activeTab === 'car' ? filteredCarRecords : filteredBikeRecords;

  // Pagination
  const totalPages = Math.ceil(activeRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return activeRecords.slice(start, start + pageSize);
  }, [activeRecords, currentPage, pageSize]);

  // Car totals
  const totalCarKm = useMemo(() => {
    return drivingRecords.reduce((sum, r) => sum + (parseFloat(r.kmTravelled) || 0), 0);
  }, [drivingRecords]);

  // Bike totals
  const totalBikeKm = useMemo(() => {
    return bikeClasses.reduce((sum, b) => sum + (parseFloat(b.kmTravelled) || 0), 0);
  }, [bikeClasses]);

  const totalBikeMinutes = useMemo(() => {
    return bikeClasses.reduce((sum, b) => sum + (parseInt(b.durationMinutes, 10) || 45), 0);
  }, [bikeClasses]);

  const handleDeleteCar = (id) => {
    if (window.confirm('Are you sure you want to delete this car driving record?')) {
      deleteDrivingRecord(id);
    }
  };

  const handleDeleteBike = (id) => {
    if (window.confirm('Delete this bike class entry? The associated ₹300 charge will be updated.')) {
      deleteBikeClass(id);
    }
  };

  return (
    <div className="space-y-6 pb-16 animate-fade-in">
      {/* Main Mode Tabs: Car vs Bike */}
      <div className="flex border-b border-[#E2E8F0] gap-2 overflow-x-auto">
        <button
          onClick={() => {
            setActiveTab('car');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'car'
              ? 'border-[#FBA920] text-[#0E113C]'
              : 'border-transparent text-[#5A627A] hover:text-[#0E113C]'
          }`}
        >
          <Car className={`w-4 h-4 ${activeTab === 'car' ? 'text-[#FBA920]' : 'text-[#5A627A]'}`} />
          <span>Car Practice</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('bike');
            setCurrentPage(1);
          }}
          className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-extrabold border-b-2 transition-all cursor-pointer ${
            activeTab === 'bike'
              ? 'border-[#FBA920] text-[#0E113C]'
              : 'border-transparent text-[#5A627A] hover:text-[#0E113C]'
          }`}
        >
          <Bike className={`w-4 h-4 ${activeTab === 'bike' ? 'text-[#FBA920]' : 'text-[#5A627A]'}`} />
          <span>Bike Classes</span>
        </button>
      </div>

      {/* KPI Cards based on Active Tab */}
      {activeTab === 'car' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5A627A]">Total Car Driving Sessions</span>
              <p className="text-2xl font-extrabold text-[#0E113C] mt-1">{drivingRecords.length}</p>
            </div>
            <div className="p-3 bg-[#EEF0F8] rounded-xl text-[#0E113C]">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5A627A]">Total KM Travelled (Car)</span>
              <p className="text-2xl font-extrabold text-[#0E113C] mt-1">{totalCarKm.toFixed(1)} KM</p>
            </div>
            <div className="p-3 bg-[#FFF8EB] rounded-xl text-[#E0910E]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5A627A]">Active Trainees</span>
              <p className="text-2xl font-extrabold text-[#0E113C] mt-1">{stats.activeStudents}</p>
            </div>
            <div className="p-3 bg-[#EEF0F8] rounded-xl text-[#0E113C]">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5A627A]">Total Bike Classes</span>
              <p className="text-2xl font-extrabold text-[#0E113C] mt-1">{bikeClasses.length}</p>
            </div>
            <div className="p-3 bg-[#EEF0F8] rounded-xl text-[#0E113C]">
              <Bike className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5A627A]">Total Bike Practice Time</span>
              <p className="text-2xl font-extrabold text-[#0E113C] mt-1">{totalBikeMinutes} Min</p>
              <p className="text-[10px] text-[#5A627A]">~{(totalBikeMinutes / 60).toFixed(1)} Hours</p>
            </div>
            <div className="p-3 bg-[#EEF0F8] rounded-xl text-[#0E113C]">
              <Clock className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5A627A]">Total KM (Bike)</span>
              <p className="text-2xl font-extrabold text-[#0E113C] mt-1">{totalBikeKm.toFixed(1)} KM</p>
            </div>
            <div className="p-3 bg-[#FFF8EB] rounded-xl text-[#E0910E]">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-[#5A627A]">Bike Charges Billed</span>
              <p className="text-2xl font-black text-[#E0910E] mt-1">₹{(bikeClasses.length * 300).toLocaleString('en-IN')}</p>
              <p className="text-[10px] text-[#5A627A]">₹300 per recorded class</p>
            </div>
            <div className="p-3 bg-[#FFF8EB] rounded-xl text-[#E0910E]">
              <Award className="w-5 h-5" />
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center justify-between">
          {/* Live Autocomplete Student Search Bar */}
          <div className="relative flex-1" ref={searchContainerRef}>
            <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              onFocus={() => {
                if (searchQuery.trim().length > 0) {
                  setIsAutocompleteOpen(true);
                }
              }}
              onKeyDown={handleSearchKeyDown}
              placeholder={
                activeTab === 'car'
                  ? 'Search student name, ID, vehicle details...'
                  : 'Search student name, ID, bike, remarks...'
              }
              className="w-full bg-[#F6F8FB] focus:bg-white text-sm text-[#0E113C] pl-10 pr-9 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 transition-all placeholder:text-[#94A3B8]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#0E113C] hover:bg-[#EEF0F8] rounded-full transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Live Autocomplete Dropdown List Directly Underneath */}
            {isAutocompleteOpen && searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white rounded-xl border border-[#E2E8F0] shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-fade-in">
                <div className="px-3.5 py-2 bg-[#F8FAFC] border-b border-[#E2E8F0] flex items-center justify-between text-[11px] font-bold text-[#5A627A]">
                  <div className="flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#FBA920]" />
                    <span>STUDENT SUGGESTIONS ({matchingStudents.length})</span>
                  </div>
                  <span className="text-[10px] text-[#94A3B8]">Click to select & filter</span>
                </div>

                {matchingStudents.length > 0 ? (
                  <ul className="divide-y divide-[#F1F5F9]">
                    {matchingStudents.map((st) => {
                      const isSelected = selectedStudent?.id === st.id;
                      return (
                        <li key={st.id}>
                          <button
                            type="button"
                            onClick={() => handleSelectStudent(st)}
                            className={`w-full text-left px-3.5 py-2.5 flex items-center justify-between gap-3 hover:bg-[#FFF8EB] transition-colors cursor-pointer group ${
                              isSelected ? 'bg-[#FFF8EB]' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div className="w-7 h-7 rounded-full bg-[#0E113C] text-[#FBA920] flex items-center justify-center font-bold text-xs shrink-0 group-hover:scale-105 transition-transform">
                                {(st.name || 'S').charAt(0).toUpperCase()}
                              </div>
                              <div className="truncate">
                                <p className="text-xs sm:text-sm font-bold text-[#0E113C] truncate group-hover:text-[#0E113C]">
                                  {st.name}
                                </p>
                                <p className="text-[11px] font-mono text-[#5A627A]">
                                  ID: <span className="text-[#0E113C] font-semibold">{st.id}</span>
                                  {st.phone ? ` • ${st.phone}` : ''}
                                </p>
                              </div>
                            </div>
                            <span className="shrink-0 text-[10px] font-bold px-2 py-0.5 rounded bg-[#EEF0F8] text-[#0E113C] group-hover:bg-[#FBA920] group-hover:text-[#0E113C] transition-colors">
                              Select
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <div className="p-3.5 text-center text-xs text-[#5A627A]">
                    <p className="font-semibold text-[#0E113C]">No students matching "{searchQuery}"</p>
                    <p className="text-[11px] text-[#94A3B8] mt-0.5">
                      Filtering records live by vehicle or details
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Theme-Matched Date Filter */}
          <div className="relative flex items-center bg-[#F6F8FB] hover:bg-white text-sm text-[#0E113C] px-3.5 py-2 sm:py-2.5 rounded-xl border border-[#E2E8F0] hover:border-[#CBD5E1] focus-within:border-[#FBA920] focus-within:ring-2 focus-within:ring-[#FBA920]/25 focus-within:bg-white transition-all shadow-xs gap-2 shrink-0">
            <button
              type="button"
              onClick={() => {
                try {
                  dateInputRef.current?.showPicker?.();
                } catch {
                  dateInputRef.current?.focus();
                }
              }}
              className="flex items-center gap-1.5 text-xs font-bold text-[#0E113C] cursor-pointer"
              title="Open calendar"
            >
              <Calendar className="w-4 h-4 text-[#FBA920] shrink-0" />
              <span className="hidden sm:inline font-bold text-[#0E113C]">Date:</span>
            </button>
            <input
              ref={dateInputRef}
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent text-xs sm:text-sm font-semibold text-[#0E113C] focus:outline-none cursor-pointer"
              aria-label="Filter by date"
            />
            {selectedDate && (
              <button
                type="button"
                onClick={() => {
                  setSelectedDate('');
                  setCurrentPage(1);
                }}
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-bold text-[#0E113C] bg-white hover:bg-[#EEF0F8] rounded-lg border border-[#E2E8F0] hover:border-[#CBD5E1] transition-all cursor-pointer shadow-xs shrink-0 ml-1"
                title="Clear date filter"
              >
                <X className="w-3 h-3 text-[#5A627A]" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Filters Summary (Shown when student or date filter is active) */}
        {(selectedStudent || selectedDate) && (
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#F1F5F9] text-xs">
            <span className="text-[11px] font-bold text-[#5A627A]">Active Filters:</span>
            {selectedStudent && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#FFF8EB] border border-[#FBA920]/40 rounded-lg text-[#0E113C] font-semibold text-xs">
                <User className="w-3 h-3 text-[#FBA920]" />
                <span>Student: {selectedStudent.name} ({selectedStudent.id})</span>
                <button
                  type="button"
                  onClick={handleClearStudent}
                  className="text-[#5A627A] hover:text-[#0E113C] ml-0.5 cursor-pointer"
                  title="Clear student filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            {selectedDate && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#EEF0F8] border border-[#E2E8F0] rounded-lg text-[#0E113C] font-semibold text-xs">
                <Calendar className="w-3 h-3 text-[#0E113C]" />
                <span>Date: {selectedDate}</span>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedDate('');
                    setCurrentPage(1);
                  }}
                  className="text-[#5A627A] hover:text-[#0E113C] ml-0.5 cursor-pointer"
                  title="Clear date filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
            <button
              type="button"
              onClick={() => {
                setSelectedDate('');
                setSelectedStudent(null);
                setSearchQuery('');
                setCurrentPage(1);
              }}
              className="text-[11px] text-[#5A627A] hover:text-[#0E113C] underline cursor-pointer ml-1 font-medium"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* TABLE SECTION */}
      {activeTab === 'car' ? (
        /* CAR DRIVING RECORDS TABLE */
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-dd-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-3 text-center w-14">SL NO</th>
                  <th className="py-3.5 px-4">Date</th>
                  <th className="py-3.5 px-4">Student Name</th>
                  <th className="py-3.5 px-3 text-right">KM</th>
                  <th className="py-3.5 px-4">Vehicle Details</th>
                  <th className="py-3.5 px-4 text-center">Instructor</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-xs text-[#94A3B8]">
                      No car practice records found matching filters.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((rec, idx) => (
                    <tr key={rec.id} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3.5 px-3 text-center font-bold text-[#0E113C]">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0E113C] whitespace-nowrap">
                        {rec.date}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0E113C]">
                        <Link to={`/students/${rec.studentId}`} className="hover:underline hover:text-[#E0910E]">
                          {rec.studentName}
                        </Link>
                        <div className="text-[11px] font-mono text-[#5A627A] font-normal">{rec.studentId}</div>
                      </td>
                      <td className="py-3.5 px-3 text-right font-black text-[#0E113C]">
                        {rec.kmTravelled} KM
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0E113C]">{rec.vehicleDetails || 'Maruti Swift'}</div>
                        <div className="text-[11px] text-[#5A627A] font-mono">{rec.vehicleNumber || 'KL-11-AB-1234'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-[#0E113C]">
                        {rec.instructorSignature || rec.instructor || 'Rajesh K.'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingCarRecord(rec)}
                            className="p-1.5 text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] rounded-lg transition-colors cursor-pointer"
                            title="Edit Record"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCar(rec.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                            title="Delete Record"
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
      ) : (
        /* BIKE CLASSES TABLE */
        <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-dd-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
                <tr>
                  <th className="py-3.5 px-3 text-center w-14">SL NO</th>
                  <th className="py-3.5 px-4">DATE</th>
                  <th className="py-3.5 px-4">STUDENT NAME</th>
                  <th className="py-3.5 px-3">FROM</th>
                  <th className="py-3.5 px-3">TO</th>
                  <th className="py-3.5 px-3 text-center">TIME IN MIN</th>
                  <th className="py-3.5 px-3 text-right">KM</th>
                  <th className="py-3.5 px-4">VEHICLE</th>
                  <th className="py-3.5 px-4 text-center">INSTRUCTOR</th>
                  <th className="py-3.5 px-4 text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] bg-white">
                {paginatedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-xs text-[#94A3B8]">
                      No bike class entries found matching filters.
                    </td>
                  </tr>
                ) : (
                  paginatedRecords.map((bike, idx) => (
                    <tr key={bike.id} className="hover:bg-[#F6F8FB] transition-colors">
                      <td className="py-3.5 px-3 text-center font-bold text-[#0E113C]">
                        {(currentPage - 1) * pageSize + idx + 1}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0E113C] whitespace-nowrap">
                        {bike.date}
                      </td>
                      <td className="py-3.5 px-4 font-extrabold text-[#0E113C]">
                        <Link to={`/students/${bike.studentId}`} className="hover:underline hover:text-[#E0910E]">
                          {bike.studentName}
                        </Link>
                        <div className="text-[11px] font-mono text-[#5A627A] font-normal">{bike.studentId}</div>
                      </td>
                      <td className="py-3.5 px-3 font-mono text-[#5A627A]">{bike.fromTime}</td>
                      <td className="py-3.5 px-3 font-mono text-[#5A627A]">{bike.toTime}</td>
                      <td className="py-3.5 px-3 text-center font-bold text-[#0E113C]">{bike.durationMinutes || 45} min</td>
                      <td className="py-3.5 px-3 text-right font-black text-[#0E113C]">{bike.kmTravelled}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-[#0E113C]">{bike.vehicleDetails || 'Hero Splendor Plus'}</div>
                        <div className="text-[11px] text-[#5A627A] font-mono">{bike.vehicleNumber || 'KL-11-BK-1102'}</div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-medium text-[#0E113C]">
                        {bike.instructorSignature || bike.instructor || 'Manoj P.'}
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => setEditingBikeClass(bike)}
                            className="p-1.5 text-[#5A627A] hover:text-[#0E113C] hover:bg-[#EEF0F8] rounded-lg transition-colors cursor-pointer"
                            title="Edit entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBike(bike.id)}
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

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-xs text-[#5A627A] pt-2">
          <span>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, activeRecords.length)} of {activeRecords.length} entries
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-[#0E113C]">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-xl bg-white border border-[#E2E8F0] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* MODALS */}
      <AddDrivingRecordModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
      />

      <EditDrivingRecordModal
        isOpen={!!editingCarRecord}
        onClose={() => setEditingCarRecord(null)}
        record={editingCarRecord}
      />

      <AddBikeClassModal
        isOpen={isAddBikeModalOpen}
        onClose={() => setIsAddBikeModalOpen(false)}
      />

      <EditBikeClassModal
        isOpen={!!editingBikeClass}
        onClose={() => setEditingBikeClass(null)}
        bikeClass={editingBikeClass}
      />
    </div>
  );
}
