import React, { useMemo, useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

const HOURS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
const MINUTES = ['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'];

/**
 * Safely parse a time string like "08:00 AM" into { hour, minute, period }
 */
function parseTimeString(timeStr) {
  if (!timeStr || typeof timeStr !== 'string') {
    return { hour: '08', minute: '00', period: 'AM' };
  }

  const match = timeStr.trim().match(/^(\d{1,2}):(\d{2})\s*(AM|PM)?$/i);
  if (!match) {
    return { hour: '08', minute: '00', period: 'AM' };
  }

  let h = parseInt(match[1], 10);
  if (isNaN(h) || h < 1 || h > 12) h = 8;
  const hour = String(h).padStart(2, '0');

  let m = parseInt(match[2], 10);
  if (isNaN(m) || m < 0 || m > 59) m = 0;
  // Snap to nearest 5 minutes
  m = Math.round(m / 5) * 5;
  if (m >= 60) m = 55;
  const minute = String(m).padStart(2, '0');

  const period = (match[3] || 'AM').toUpperCase() === 'PM' ? 'PM' : 'AM';

  return { hour, minute, period };
}

/**
 * Alarm-style time selector component
 * - Custom Hour dropdown list (01–12) opening downward
 * - Custom Minute dropdown list (00–55 in 5-min steps) opening downward
 * - White background, #0E113C selected state with #FBA920 text
 * - AM/PM toggle button
 * - Styled with #0E113C and #FBA920 brand theme
 * - Emits formatted time string: "08:00 AM"
 */
export default function AlarmTimeSelector({
  value = '08:00 AM',
  onChange,
  id = 'time-selector',
  ariaLabelPrefix = 'Time'
}) {
  const { hour, minute, period } = useMemo(() => parseTimeString(value), [value]);

  const [isHourOpen, setIsHourOpen] = useState(false);
  const [isMinuteOpen, setIsMinuteOpen] = useState(false);

  const hourDropdownRef = useRef(null);
  const minuteDropdownRef = useRef(null);
  const hourSelectedRef = useRef(null);
  const minuteSelectedRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (hourDropdownRef.current && !hourDropdownRef.current.contains(event.target)) {
        setIsHourOpen(false);
      }
      if (minuteDropdownRef.current && !minuteDropdownRef.current.contains(event.target)) {
        setIsMinuteOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdowns on Escape key
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        setIsHourOpen(false);
        setIsMinuteOpen(false);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  // Scroll to selected item when opened
  useEffect(() => {
    if (isHourOpen && hourSelectedRef.current) {
      hourSelectedRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [isHourOpen]);

  useEffect(() => {
    if (isMinuteOpen && minuteSelectedRef.current) {
      minuteSelectedRef.current.scrollIntoView({ block: 'nearest', inline: 'nearest' });
    }
  }, [isMinuteOpen]);

  const handleSelectHour = (newHour) => {
    setIsHourOpen(false);
    if (onChange) {
      onChange(`${newHour}:${minute} ${period}`);
    }
  };

  const handleSelectMinute = (newMinute) => {
    setIsMinuteOpen(false);
    if (onChange) {
      onChange(`${hour}:${newMinute} ${period}`);
    }
  };

  const handlePeriodToggle = (targetPeriod) => {
    let nextPeriod;
    if (targetPeriod) {
      nextPeriod = targetPeriod === period ? (period === 'AM' ? 'PM' : 'AM') : targetPeriod;
    } else {
      nextPeriod = period === 'AM' ? 'PM' : 'AM';
    }
    if (onChange) {
      onChange(`${hour}:${minute} ${nextPeriod}`);
    }
  };

  return (
    <div
      className={`relative flex items-center justify-between gap-1.5 p-2 bg-[#F6F8FB] border rounded-xl transition-all shadow-xs ${
        isHourOpen || isMinuteOpen
          ? 'z-30 border-[#0E113C]/40 ring-1 ring-[#FBA920]/40'
          : 'border-[#E2E8F0] hover:border-[#0E113C]/30 focus-within:border-[#FBA920] focus-within:ring-2 focus-within:ring-[#FBA920]/25'
      }`}
      data-testid={`${id}-container`}
    >
      {/* Alarm Digital Time Dropdowns */}
      <div className="flex items-center gap-1.5">
        {/* Custom Hour Dropdown (01–12) */}
        <div ref={hourDropdownRef} className="relative">
          <button
            type="button"
            id={`${id}-hour`}
            aria-label={`${ariaLabelPrefix} Hour`}
            aria-haspopup="listbox"
            aria-expanded={isHourOpen}
            onClick={() => {
              setIsHourOpen((prev) => !prev);
              setIsMinuteOpen(false);
            }}
            className={`px-2.5 py-1.5 min-w-[3.75rem] text-sm font-mono font-extrabold bg-white border rounded-lg focus:outline-none cursor-pointer shadow-xs transition-colors flex items-center justify-between gap-1.5 ${
              isHourOpen
                ? 'border-[#FBA920] ring-1 ring-[#FBA920] text-[#0E113C]'
                : 'border-[#E2E8F0] text-[#0E113C] hover:border-[#0E113C]/40'
            }`}
          >
            <span className="font-mono">{hour}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#5A627A] transition-transform duration-200 ${
                isHourOpen ? 'rotate-180 text-[#0E113C]' : ''
              }`}
            />
          </button>

          {isHourOpen && (
            <div
              role="listbox"
              aria-label={`${ariaLabelPrefix} Hour Options`}
              className="absolute top-full mt-1 left-0 w-full min-w-[3.75rem] max-h-40 overflow-y-auto bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 py-1"
            >
              {HOURS.map((h) => {
                const isSelected = h === hour;
                return (
                  <button
                    key={h}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectHour(h)}
                    ref={isSelected ? hourSelectedRef : null}
                    className={`w-full px-2.5 py-1.5 text-sm font-mono text-center cursor-pointer transition-colors block ${
                      isSelected
                        ? 'bg-[#0E113C] text-[#FBA920] font-extrabold'
                        : 'text-[#0E113C] hover:bg-[#FFF8EB] font-bold'
                    }`}
                  >
                    {h}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Alarm Digital Separator */}
        <span className="font-mono font-black text-[#0E113C] text-sm select-none px-0.5">
          :
        </span>

        {/* Custom Minute Dropdown (00–55 in 5-min steps) */}
        <div ref={minuteDropdownRef} className="relative">
          <button
            type="button"
            id={`${id}-minute`}
            aria-label={`${ariaLabelPrefix} Minute`}
            aria-haspopup="listbox"
            aria-expanded={isMinuteOpen}
            onClick={() => {
              setIsMinuteOpen((prev) => !prev);
              setIsHourOpen(false);
            }}
            className={`px-2.5 py-1.5 min-w-[3.75rem] text-sm font-mono font-extrabold bg-white border rounded-lg focus:outline-none cursor-pointer shadow-xs transition-colors flex items-center justify-between gap-1.5 ${
              isMinuteOpen
                ? 'border-[#FBA920] ring-1 ring-[#FBA920] text-[#0E113C]'
                : 'border-[#E2E8F0] text-[#0E113C] hover:border-[#0E113C]/40'
            }`}
          >
            <span className="font-mono">{minute}</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#5A627A] transition-transform duration-200 ${
                isMinuteOpen ? 'rotate-180 text-[#0E113C]' : ''
              }`}
            />
          </button>

          {isMinuteOpen && (
            <div
              role="listbox"
              aria-label={`${ariaLabelPrefix} Minute Options`}
              className="absolute top-full mt-1 left-0 w-full min-w-[3.75rem] max-h-40 overflow-y-auto bg-white border border-[#E2E8F0] rounded-xl shadow-xl z-50 py-1"
            >
              {MINUTES.map((m) => {
                const isSelected = m === minute;
                return (
                  <button
                    key={m}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectMinute(m)}
                    ref={isSelected ? minuteSelectedRef : null}
                    className={`w-full px-2.5 py-1.5 text-sm font-mono text-center cursor-pointer transition-colors block ${
                      isSelected
                        ? 'bg-[#0E113C] text-[#FBA920] font-extrabold'
                        : 'text-[#0E113C] hover:bg-[#FFF8EB] font-bold'
                    }`}
                  >
                    {m}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* AM / PM Toggle Button */}
      <div
        className="inline-flex p-0.5 rounded-lg bg-[#EEF0F8] border border-[#D5DAEE] shadow-inner select-none shrink-0"
        role="group"
        aria-label={`${ariaLabelPrefix} AM/PM toggle`}
      >
        <button
          type="button"
          onClick={() => handlePeriodToggle('AM')}
          aria-label="Toggle AM"
          aria-pressed={period === 'AM'}
          className={`px-2.5 py-1.5 text-sm font-bold rounded-md transition-all cursor-pointer ${
            period === 'AM'
              ? 'bg-[#0E113C] text-[#FBA920] shadow-sm'
              : 'text-[#5A627A] hover:text-[#0E113C] hover:bg-[#E2E8F0]'
          }`}
        >
          AM
        </button>
        <button
          type="button"
          onClick={() => handlePeriodToggle('PM')}
          aria-label="Toggle PM"
          aria-pressed={period === 'PM'}
          className={`px-2.5 py-1.5 text-sm font-bold rounded-md transition-all cursor-pointer ${
            period === 'PM'
              ? 'bg-[#0E113C] text-[#FBA920] shadow-sm'
              : 'text-[#5A627A] hover:text-[#0E113C] hover:bg-[#E2E8F0]'
          }`}
        >
          PM
        </button>
      </div>
    </div>
  );
}
