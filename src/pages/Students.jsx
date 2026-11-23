import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  Eye,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  UserX,
  AlertTriangle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CLASS_MODES } from '../data/initialData';
import EditStudentModal from '../components/modals/EditStudentModal';
import CustomSelect from '../components/common/CustomSelect';

export default function Students() {
  const { students, deleteStudent, setStudentFilteredCount } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modeFilter, setModeFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected student for editing or deleting
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Filter students based on search, status, mode
  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      // Search matching
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        student.name.toLowerCase().includes(q) ||
        student.id.toLowerCase().includes(q) ||
        (student.phone1 && student.phone1.includes(q)) ||
        (student.applicationNo && student.applicationNo.toLowerCase().includes(q));

      // Status matching
      const matchesStatus =
        statusFilter === 'All' || student.status === statusFilter;

      // Mode matching
      const matchesMode =
        modeFilter === 'All' || student.classOfMode === modeFilter;

      return matchesSearch && matchesStatus && matchesMode;
    });
  }, [students, searchQuery, statusFilter, modeFilter]);

  // Sync filtered student count to top header
  useEffect(() => {
    setStudentFilteredCount(filteredStudents.length);
    return () => {
      setStudentFilteredCount(null);
    };
  }, [filteredStudents.length, setStudentFilteredCount]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredStudents.length / pageSize) || 1;
  const paginatedStudents = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, currentPage, pageSize]);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const confirmDelete = () => {
    if (studentToDelete) {
      deleteStudent(studentToDelete.id);
      setStudentToDelete(null);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Filter and Search Bar Card */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E2E8F0] shadow-dd-card flex flex-col md:flex-row gap-3.5 items-stretch md:items-center justify-between">
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
            placeholder="Search by student name, ID, phone, or application #..."
            className="w-full bg-[#F6F8FB] focus:bg-white text-sm text-[#0E113C] pl-10 pr-4 py-2.5 rounded-xl border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 transition-all placeholder:text-[#94A3B8]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
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
              { value: 'Active', label: 'Active' },
              { value: 'Completed', label: 'Completed' },
              { value: 'Inactive', label: 'Inactive' },
            ]}
            size="sm"
            autoWidth={true}
            className="bg-[#F6F8FB]"
          />

          {/* Mode Filter */}
          <CustomSelect
            prefix="Class of Rule:"
            value={modeFilter}
            onChange={(e) => {
              setModeFilter(e.target.value);
              setCurrentPage(1);
            }}
            options={[
              { value: 'All', label: 'All Rules' },
              ...CLASS_MODES.map((mode) => ({ value: mode, label: mode })),
            ]}
            size="sm"
            autoWidth={true}
            className="bg-[#F6F8FB]"
          />
        </div>
      </div>

      {/* Student Data Table Card */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-dd-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-[#EEF0F8] text-[#0E113C] font-bold uppercase text-[11px] tracking-wider border-b border-[#E2E8F0]">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Student ID</th>
                <th className="py-3.5 px-4 sm:px-6">Student Name</th>
                <th className="py-3.5 px-4 sm:px-6">Mobile Number</th>
                <th className="py-3.5 px-4 sm:px-6">Class of Rule</th>
                <th className="py-3.5 px-4 sm:px-6">Joining Date</th>
                <th className="py-3.5 px-4 sm:px-6">Status</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] bg-white">
              {paginatedStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center">
                    <div className="flex flex-col items-center justify-center text-[#94A3B8]">
                      <UserX className="w-10 h-10 mb-2 stroke-1" />
                      <p className="text-sm font-bold text-[#0E113C]">
                        No matching students found
                      </p>
                      <p className="text-xs text-[#5A627A] mt-0.5">
                        Try clearing or modifying your search and filter criteria.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                paginatedStudents.map((st) => (
                  <tr
                    key={st.id}
                    className="hover:bg-[#F6F8FB] transition-colors group"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-mono text-xs font-bold text-[#0E113C]">
                      {st.id}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <Link
                        to={`/students/${st.id}`}
                        className="flex items-center gap-3 group/student cursor-pointer w-fit"
                        title={`View ${st.name}'s Profile`}
                      >
                        <img
                          src={st.photo}
                          alt={st.name}
                          className="w-8 h-8 rounded-full object-cover border border-[#E2E8F0] bg-[#EEF0F8] transition-all group-hover/student:ring-2 group-hover/student:ring-[#FBA920]/60 group-hover/student:border-[#FBA920]"
                        />
                        <div>
                          <div className="font-bold text-[#0E113C] transition-colors group-hover/student:text-[#FBA920] group-hover/student:underline underline-offset-2">
                            {st.name}
                          </div>
                          <div className="text-[11px] text-[#5A627A]">
                            App: {st.applicationNo || 'N/A'}
                          </div>
                        </div>
                      </Link>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#0E113C] font-mono text-xs font-semibold">
                      {st.phone1}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
                      <span className="inline-block px-2.5 py-1 rounded-md bg-[#FFF8EB] text-[#0E113C] text-xs font-semibold border border-[#FBA920]/30">
                        {st.classOfMode}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-[#5A627A]">
                      {st.startDate}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6">
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
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          to={`/students/${st.id}`}
                          className="p-1.5 rounded-lg text-[#0E113C] hover:bg-[#EEF0F8] hover:text-[#FBA920] transition-colors cursor-pointer"
                          title="View Student Profile"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => setEditingStudent(st)}
                          className="p-1.5 rounded-lg text-[#0E113C] hover:bg-[#EEF0F8] transition-colors cursor-pointer"
                          title="Edit Student"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(st)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete Student"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        {filteredStudents.length > 0 && (
          <div className="px-6 py-4 border-t border-[#E2E8F0] bg-white flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#5A627A]">
            <div>
              Showing{' '}
              <span className="font-bold text-[#0E113C]">
                {(currentPage - 1) * pageSize + 1}
              </span>{' '}
              to{' '}
              <span className="font-bold text-[#0E113C]">
                {Math.min(currentPage * pageSize, filteredStudents.length)}
              </span>{' '}
              of{' '}
              <span className="font-bold text-[#0E113C]">
                {filteredStudents.length}
              </span>{' '}
              students
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="px-3 py-1 font-bold text-[#0E113C] text-xs">
                Page {currentPage} of {totalPages}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg border border-[#E2E8F0] text-[#0E113C] hover:bg-[#EEF0F8] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Student Modal */}
      {editingStudent && (
        <EditStudentModal
          isOpen={!!editingStudent}
          onClose={() => setEditingStudent(null)}
          student={editingStudent}
        />
      )}

      {/* Delete Confirmation Modal */}
      {studentToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#070926]/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-2xl border border-[#E2E8F0] space-y-4">
            <div className="flex items-center gap-3 text-red-600">
              <div className="p-2 rounded-xl bg-red-50 text-red-600">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#0E113C]">
                Delete Student Record
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#5A627A]">
              Are you sure you want to delete student{' '}
              <strong className="text-[#0E113C]">{studentToDelete.name}</strong> (
              {studentToDelete.id})? This action cannot be undone.
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setStudentToDelete(null)}
                className="px-4 py-2 text-xs font-semibold text-[#0E113C] bg-white border border-[#E2E8F0] rounded-xl hover:bg-[#EEF0F8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-xs font-bold text-white bg-[#DC2626] hover:bg-red-700 rounded-xl transition-colors shadow-sm"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
