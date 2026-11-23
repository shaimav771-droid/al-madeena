import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Calendar, X, Clock } from 'lucide-react';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const MONTH_NAMES_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

// Common decades for driving school students (1950s up to 2020s)
const DECADE_PRESETS = [1960, 1970, 1980, 1990, 2000, 2010, 2020];

/**
 * Safely parse 'YYYY-MM-DD' into { year, month (0-11), day }
 */
function parseDateParts(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  const year = parseInt(match[1], 10);
  const month = parseInt(match[2], 10) - 1;
  const day = parseInt(match[3], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  return { year, month, day };
}

/**
 * Format year, month (0-11), day into 'YYYY-MM-DD'
 */
function formatDateParts(year, month, day) {
  const y = String(year).padStart(4, '0');
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Format 'YYYY-MM-DD' into readable '14 May 1998'
 */
function formatDisplayDate(dateStr) {
  const parts = parseDateParts(dateStr);
  if (!parts) return '';
  const monthName = MONTH_NAMES_SHORT[parts.month];
  return `${parts.day} ${monthName} ${parts.year}`;
}

/**
 * Days in month helper
 */
function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * First day of week (0 = Sunday)
 */
function getFirstDayOfWeek(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * DriveDesk Custom Themed Calendar Date Picker
 * - Styled with Deep Navy (#0E113C) and Golden Amber (#FBA920) theme
 * - Quick Month and Year selection via dedicated picker views
 * - Highlighted selected date in #FBA920
 * - "Clear" and "Today" quick action buttons
 * - Emits standard 'YYYY-MM-DD' format via synthetic event to work with standard handleChange
 */
export default function CustomDatePicker({
  value = '',
  onChange,
  name = 'dob',
  id,
  placeholder = 'Select Date of Birth',
  disabled = false,
  required = false,
  error = false,
  className = '',
  containerClassName = '',
  dropdownPosition = 'bottom',
  defaultViewYear = null,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState(dropdownPosition === 'top' ? 'top' : 'bottom');
  const [pickerMode, setPickerMode] = useState('day'); // 'day' | 'month' | 'year'

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const popupRef = useRef(null);

  const today = useMemo(() => new Date(), []);
  const todayParts = useMemo(
    () => ({
      year: today.getFullYear(),
      month: today.getMonth(),
      day: today.getDate(),
      dateStr: formatDateParts(today.getFullYear(), today.getMonth(), today.getDate())
    }),
    [today]
  );

  const selectedParts = useMemo(() => parseDateParts(value), [value]);

  // Current calendar view state (year & month)
  const [viewYear, setViewYear] = useState(() => {
    if (selectedParts) return selectedParts.year;
    if (defaultViewYear) return defaultViewYear;
    // Default to ~18-20 years ago if empty (great default for DOB in a driving school)
    return today.getFullYear() - 18;
  });

  const [viewMonth, setViewMonth] = useState(() => {
    if (selectedParts) return selectedParts.month;
    return today.getMonth();
  });

  // Decade starting year for year selection grid
  const [decadeStart, setDecadeStart] = useState(() => {
    const yr = selectedParts ? selectedParts.year : (defaultViewYear || today.getFullYear() - 18);
    return Math.floor(yr / 10) * 10;
  });

  // When value changes from outside, synchronize view if open or value set
  useEffect(() => {
    if (selectedParts) {
      setViewYear(selectedParts.year);
      setViewMonth(selectedParts.month);
      setDecadeStart(Math.floor(selectedParts.year / 10) * 10);
    }
  }, [value]);

  // Update placement (top vs bottom) based on viewport
  const updatePlacement = () => {
    if (dropdownPosition === 'top') {
      setPlacement('top');
      return;
    }
    if (dropdownPosition === 'bottom') {
      setPlacement('bottom');
      return;
    }

    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // Popup is ~340px tall; flip to top if space below is limited
      if (spaceBelow < 340 && spaceAbove > spaceBelow) {
        setPlacement('top');
      } else {
        setPlacement('bottom');
      }
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePlacement();
      setPickerMode('day');
      if (selectedParts) {
        setViewYear(selectedParts.year);
        setViewMonth(selectedParts.month);
        setDecadeStart(Math.floor(selectedParts.year / 10) * 10);
      }
    }
    setIsOpen((prev) => !prev);
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
        setPickerMode('day');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Ensure popup is smoothly scrolled into view inside modals or scroll containers if needed
  useEffect(() => {
    if (isOpen && popupRef.current) {
      const timer = setTimeout(() => {
        popupRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Keyboard navigation & escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsOpen(false);
        setPickerMode('day');
        triggerRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Notify change with synthetic event for form compatibility
  const emitChange = (newDateStr) => {
    if (onChange) {
      const syntheticEvent = {
        target: { name: name || id || 'dob', value: newDateStr },
        currentTarget: { name: name || id || 'dob', value: newDateStr },
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      onChange(syntheticEvent, newDateStr);
    }
  };

  const handleSelectDay = (cell) => {
    emitChange(cell.dateStr);
    // If user clicked leading/trailing day from neighbor month, sync view
    if (cell.month !== viewMonth || cell.year !== viewYear) {
      setViewYear(cell.year);
      setViewMonth(cell.month);
    }
    setIsOpen(false);
  };

  const handleClear = () => {
    emitChange('');
    setIsOpen(false);
    setPickerMode('day');
  };

  const handleToday = () => {
    emitChange(todayParts.dateStr);
    setViewYear(todayParts.year);
    setViewMonth(todayParts.month);
    setDecadeStart(Math.floor(todayParts.year / 10) * 10);
    setIsOpen(false);
    setPickerMode('day');
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((prev) => prev - 1);
    } else {
      setViewMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((prev) => prev + 1);
    } else {
      setViewMonth((prev) => prev + 1);
    }
  };

  // Build grid cells for current month view
  const calendarCells = useMemo(() => {
    const daysInCurrentMonth = getDaysInMonth(viewYear, viewMonth);
    const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear = viewMonth === 0 ? viewYear - 1 : viewYear;
    const daysInPrevMonth = getDaysInMonth(prevYear, prevMonth);

    const cells = [];

    // Leading days from previous month
    for (let i = firstDay - 1; i >= 0; i--) {
      const d = daysInPrevMonth - i;
      cells.push({
        day: d,
        month: prevMonth,
        year: prevYear,
        isCurrentMonth: false,
        dateStr: formatDateParts(prevYear, prevMonth, d)
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInCurrentMonth; d++) {
      cells.push({
        day: d,
        month: viewMonth,
        year: viewYear,
        isCurrentMonth: true,
        dateStr: formatDateParts(viewYear, viewMonth, d)
      });
    }

    // Trailing days from next month to complete standard 35 or 42 grid
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear = viewMonth === 11 ? viewYear + 1 : viewYear;
    const totalCellsTarget = cells.length > 35 ? 42 : 35;
    const remaining = totalCellsTarget - cells.length;

    for (let d = 1; d <= remaining; d++) {
      cells.push({
        day: d,
        month: nextMonth,
        year: nextYear,
        isCurrentMonth: false,
        dateStr: formatDateParts(nextYear, nextMonth, d)
      });
    }

    return cells;
  }, [viewYear, viewMonth]);

  // 12 years for decade grid
  const decadeYears = useMemo(() => {
    const years = [];
    for (let y = decadeStart; y < decadeStart + 12; y++) {
      years.push(y);
    }
    return years;
  }, [decadeStart]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isOpen ? 'z-50' : 'z-auto'} ${containerClassName}`}
    >
      {/* Hidden input for form submission if required */}
      {name && (
        <input
          type="hidden"
          name={name}
          id={id}
          value={value || ''}
          required={required}
          readOnly
        />
      )}

      {/* Trigger Box */}
      <button
        type="button"
        ref={triggerRef}
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        aria-label={`${name || 'Date'} picker`}
        className={`w-full px-3.5 py-2 text-sm bg-white rounded-xl border text-left font-medium transition-all duration-150 cursor-pointer flex items-center justify-between gap-2 shadow-xs select-none ${
          isOpen
            ? 'border-[#FBA920] ring-2 ring-[#FBA920]/25 text-[#0E113C]'
            : error
            ? 'border-red-400 text-[#0E113C] focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20'
            : 'border-[#E2E8F0] text-[#0E113C] hover:border-[#0E113C]/40 focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''} ${className}`}
      >
        <div className="flex items-center gap-2.5 truncate min-w-0">
          <Calendar
            className={`w-4 h-4 shrink-0 transition-colors ${
              isOpen || value ? 'text-[#FBA920]' : 'text-[#5A627A]'
            }`}
          />
          {value ? (
            <span className="text-[#0E113C] font-bold truncate">
              {formatDisplayDate(value)}
            </span>
          ) : (
            <span className="text-[#94A3B8] font-normal truncate">
              {placeholder}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {value && !disabled && (
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
              title="Clear date"
              className="p-1 rounded-md text-[#94A3B8] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </span>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 text-[#5A627A] transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#0E113C]' : ''
            }`}
          />
        </div>
      </button>

      {/* Themed Custom Calendar Popup */}
      {isOpen && (
        <div
          ref={popupRef}
          role="dialog"
          aria-label="Calendar date selector"
          className={`absolute left-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl shadow-[#0E113C]/18 border border-[#E2E8F0] w-[310px] sm:w-[320px] max-w-[calc(100vw-2rem)] overflow-hidden select-none animate-in fade-in-50 duration-150 ${
            placement === 'top' ? '!bottom-full !top-auto mb-2 !mt-0' : 'top-full mt-2 left-0'
          }`}
        >
          {/* Header Bar: Deep Navy (#0E113C) with Golden Amber (#FBA920) Accents */}
          <div className="bg-[#0E113C] text-white px-3.5 py-3 border-b border-[#181C54] flex items-center justify-between">
            {pickerMode === 'day' ? (
              <>
                <button
                  type="button"
                  onClick={handlePrevMonth}
                  aria-label="Previous month"
                  className="p-1.5 rounded-lg text-[#EEF0F8] hover:text-[#FBA920] hover:bg-[#181C54] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {/* Quick Month & Year Switcher Buttons */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPickerMode('month')}
                    className="px-2.5 py-1 text-xs font-bold bg-[#181C54] hover:bg-[#222770] text-[#FBA920] rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs border border-white/10"
                    title="Quick select month"
                  >
                    <span>{MONTH_NAMES[viewMonth]}</span>
                    <ChevronDown className="w-3 h-3 text-[#FBA920]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDecadeStart(Math.floor(viewYear / 10) * 10);
                      setPickerMode('year');
                    }}
                    className="px-2.5 py-1 text-xs font-bold bg-[#181C54] hover:bg-[#222770] text-white hover:text-[#FBA920] rounded-lg transition-colors flex items-center gap-1 cursor-pointer shadow-xs border border-white/10"
                    title="Quick select year"
                  >
                    <span>{viewYear}</span>
                    <ChevronDown className="w-3 h-3 text-[#EEF0F8]" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleNextMonth}
                  aria-label="Next month"
                  className="p-1.5 rounded-lg text-[#EEF0F8] hover:text-[#FBA920] hover:bg-[#181C54] transition-colors cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : pickerMode === 'month' ? (
              <>
                <button
                  type="button"
                  onClick={() => setViewYear((y) => y - 1)}
                  aria-label="Previous year"
                  className="p-1.5 rounded-lg text-[#EEF0F8] hover:text-[#FBA920] hover:bg-[#181C54] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setDecadeStart(Math.floor(viewYear / 10) * 10);
                      setPickerMode('year');
                    }}
                    className="text-xs font-bold text-[#FBA920] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>{viewYear}</span>
                    <ChevronDown className="w-3 h-3 text-[#FBA920]" />
                  </button>
                  <p className="text-[10px] text-[#CBD5E1]">Select Month</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setViewYear((y) => y + 1)}
                    aria-label="Next year"
                    className="p-1.5 rounded-lg text-[#EEF0F8] hover:text-[#FBA920] hover:bg-[#181C54] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerMode('day')}
                    className="ml-1 p-1 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-[#181C54] transition-colors cursor-pointer"
                    title="Back to days view"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setDecadeStart((d) => d - 10)}
                  aria-label="Previous decade"
                  className="p-1.5 rounded-lg text-[#EEF0F8] hover:text-[#FBA920] hover:bg-[#181C54] transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="text-center">
                  <span className="text-xs font-bold text-[#FBA920]">
                    {decadeStart} – {decadeStart + 11}
                  </span>
                  <p className="text-[10px] text-[#CBD5E1]">Select Year</p>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setDecadeStart((d) => d + 10)}
                    aria-label="Next decade"
                    className="p-1.5 rounded-lg text-[#EEF0F8] hover:text-[#FBA920] hover:bg-[#181C54] transition-colors cursor-pointer"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setPickerMode('day')}
                    className="ml-1 p-1 rounded-lg text-[#CBD5E1] hover:text-white hover:bg-[#181C54] transition-colors cursor-pointer"
                    title="Back to days view"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Body View 1: Calendar Days Grid */}
          {pickerMode === 'day' && (
            <div className="p-3">
              {/* Day of Week Labels */}
              <div className="grid grid-cols-7 mb-1.5 text-center">
                {DAY_NAMES.map((name) => (
                  <span
                    key={name}
                    className="text-[11px] font-bold text-[#5A627A] py-1 select-none"
                  >
                    {name}
                  </span>
                ))}
              </div>

              {/* Day Cells (7 cols x 5 or 6 rows) */}
              <div className="grid grid-cols-7 gap-1">
                {calendarCells.map((cell, idx) => {
                  const isSelected = value && cell.dateStr === value;
                  const isToday = cell.dateStr === todayParts.dateStr;

                  return (
                    <button
                      key={`${cell.dateStr}-${idx}`}
                      type="button"
                      onClick={() => handleSelectDay(cell)}
                      aria-label={cell.dateStr}
                      className={`h-8 w-full text-xs rounded-lg flex items-center justify-center font-medium transition-all duration-100 cursor-pointer ${
                        isSelected
                          ? 'bg-[#FBA920] text-[#0E113C] font-extrabold shadow-sm shadow-[#FBA920]/40 scale-105 ring-1 ring-[#0E113C]/20'
                          : isToday
                          ? 'border-2 border-[#FBA920] text-[#0E113C] font-bold bg-[#FFF8EB]/70 hover:bg-[#FFF8EB]'
                          : cell.isCurrentMonth
                          ? 'text-[#0E113C] hover:bg-[#FFF8EB] hover:text-[#0E113C]'
                          : 'text-[#CBD5E1] hover:text-[#5A627A] hover:bg-[#F6F8FB]'
                      }`}
                    >
                      {cell.day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Body View 2: Quick Month Selection Grid (12 months) */}
          {pickerMode === 'month' && (
            <div className="p-3">
              <div className="grid grid-cols-3 gap-2">
                {MONTH_NAMES_SHORT.map((mShort, idx) => {
                  const isCurrentViewMonth = viewMonth === idx;
                  const isSelectedMonth =
                    selectedParts &&
                    selectedParts.year === viewYear &&
                    selectedParts.month === idx;

                  return (
                    <button
                      key={mShort}
                      type="button"
                      onClick={() => {
                        setViewMonth(idx);
                        setPickerMode('day');
                      }}
                      className={`py-2 px-2 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                        isSelectedMonth
                          ? 'bg-[#FBA920] text-[#0E113C] font-extrabold shadow-sm shadow-[#FBA920]/30 scale-102 ring-1 ring-[#0E113C]/20'
                          : isCurrentViewMonth
                          ? 'bg-[#0E113C] text-[#FBA920] font-bold shadow-xs'
                          : 'bg-[#F6F8FB] text-[#0E113C] hover:bg-[#FFF8EB] border border-[#E2E8F0]'
                      }`}
                    >
                      {mShort}
                      <span className="block text-[10px] font-normal opacity-70">
                        {MONTH_NAMES[idx].slice(0, 4)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Body View 3: Quick Year Selection Grid (with decade shortcuts) */}
          {pickerMode === 'year' && (
            <div className="p-3 space-y-2.5">
              {/* Quick Decade Jump Bar */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 scrollbar-none">
                {DECADE_PRESETS.map((dec) => {
                  const isDecadeActive = decadeStart === dec;
                  return (
                    <button
                      key={dec}
                      type="button"
                      onClick={() => setDecadeStart(dec)}
                      className={`px-2 py-1 text-[10px] font-bold rounded-lg shrink-0 transition-colors cursor-pointer ${
                        isDecadeActive
                          ? 'bg-[#0E113C] text-[#FBA920] shadow-xs'
                          : 'bg-[#EEF0F8] text-[#5A627A] hover:text-[#0E113C] hover:bg-[#D5DAEE]'
                      }`}
                    >
                      {dec}s
                    </button>
                  );
                })}
              </div>

              {/* 12 Years Grid */}
              <div className="grid grid-cols-3 gap-2">
                {decadeYears.map((yr) => {
                  const isSelectedYear = selectedParts && selectedParts.year === yr;
                  const isCurrentViewYear = viewYear === yr;

                  return (
                    <button
                      key={yr}
                      type="button"
                      onClick={() => {
                        setViewYear(yr);
                        setPickerMode('day');
                      }}
                      className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer text-center ${
                        isSelectedYear
                          ? 'bg-[#FBA920] text-[#0E113C] font-extrabold shadow-sm shadow-[#FBA920]/30 scale-102 ring-1 ring-[#0E113C]/20'
                          : isCurrentViewYear
                          ? 'bg-[#0E113C] text-[#FBA920] font-bold shadow-xs'
                          : 'bg-[#F6F8FB] text-[#0E113C] hover:bg-[#FFF8EB] border border-[#E2E8F0]'
                      }`}
                    >
                      {yr}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer Bar: "Clear" and "Today" Action Buttons */}
          <div className="bg-[#F6F8FB] px-3.5 py-2.5 border-t border-[#E2E8F0] flex items-center justify-between">
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-[#5A627A] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>

            <button
              type="button"
              onClick={handleToday}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#0E113C] bg-[#FFF8EB] hover:bg-[#FBA920] hover:text-[#0E113C] border border-[#FBA920]/40 rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              <Clock className="w-3.5 h-3.5 text-[#0E113C]" />
              <span>Today</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
