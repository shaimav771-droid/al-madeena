import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * DriveDesk InputSelect (Combobox) Component
 * - Allows typing any custom value freely (as an input)
 * - OR selecting from a themed dropdown of suggested options (as a select)
 * - Styled with DriveDesk design system (#0E113C Navy & #FBA920 Amber)
 * - Auto-detects space to open above or below
 * - Keyboard navigable (ArrowUp, ArrowDown, Enter, Escape)
 * - Closes on outside click
 */
export default function InputSelect({
  value = '',
  onChange,
  options = [],
  placeholder = '',
  id,
  name,
  disabled = false,
  required = false,
  className = '',
  containerClassName = '',
  menuClassName = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState('bottom');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options to { value, label, subtext }
  const parsedOptions = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === 'object' && opt !== null) {
        return {
          value: opt.value ?? opt.label ?? '',
          label: opt.label ?? opt.value ?? '',
          subtext: opt.subtext || null,
        };
      }
      return {
        value: String(opt),
        label: String(opt),
        subtext: null,
      };
    });
  }, [options]);

  // Filter options based on input value
  const filteredOptions = useMemo(() => {
    if (!value || typeof value !== 'string' || !value.trim()) {
      return parsedOptions;
    }
    const q = value.toLowerCase().trim();
    const matches = parsedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(q) ||
        (opt.subtext && opt.subtext.toLowerCase().includes(q))
    );
    // If input doesn't match any option, still display all options so user can switch
    return matches.length > 0 ? matches : parsedOptions;
  }, [parsedOptions, value]);

  // Auto-placement calculation (top or bottom)
  const updatePlacement = () => {
    if (inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const spaceBelow = viewportHeight - rect.bottom;
      const spaceAbove = rect.top;

      // If less than 200px below and more space above, open upward
      if (spaceBelow < 200 && spaceAbove > spaceBelow) {
        setPlacement('top');
      } else {
        setPlacement('bottom');
      }
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (opt) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      const syntheticEvent = {
        target: { name: name || id || '', value: opt.value },
        currentTarget: { name: name || id || '', value: opt.value },
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      onChange(syntheticEvent, opt.value);
    }
  };

  const handleInputChange = (e) => {
    if (disabled) return;
    if (!isOpen) {
      updatePlacement();
      setIsOpen(true);
    }
    setHighlightedIndex(-1);
    if (onChange) {
      onChange(e, e.target.value);
    }
  };

  const handleToggle = () => {
    if (disabled) return;
    if (!isOpen) {
      updatePlacement();
      setIsOpen(true);
      const curIdx = parsedOptions.findIndex(
        (opt) => String(opt.value).toLowerCase() === String(value).toLowerCase()
      );
      setHighlightedIndex(curIdx >= 0 ? curIdx : 0);
    } else {
      setIsOpen(false);
    }
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (disabled) return;
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        updatePlacement();
        setIsOpen(true);
        setHighlightedIndex(0);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredOptions.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredOptions.length - 1
      );
    } else if (e.key === 'Enter') {
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        e.preventDefault();
        handleSelect(filteredOptions[highlightedIndex]);
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-combobox-option]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${isOpen ? 'z-40' : 'z-auto'} ${containerClassName}`}
    >
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          id={id}
          name={name}
          value={value}
          onChange={handleInputChange}
          onFocus={() => {
            updatePlacement();
            setIsOpen(true);
          }}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete="off"
          className={`w-full pl-3.5 pr-9 py-2.5 text-sm bg-white rounded-xl border border-[#E2E8F0] text-[#0E113C] focus:outline-none focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20 transition-all font-medium placeholder:text-[#94A3B8] ${
            isOpen ? 'border-[#FBA920] ring-2 ring-[#FBA920]/20' : ''
          } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''} ${className}`}
        />

        <button
          type="button"
          tabIndex={-1}
          disabled={disabled}
          onClick={handleToggle}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-[#5A627A] hover:text-[#0E113C] transition-colors cursor-pointer"
          aria-label="Toggle options dropdown"
        >
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180 text-[#0E113C]' : ''
            }`}
          />
        </button>
      </div>

      {/* Themed Dropdown Menu */}
      {isOpen && filteredOptions.length > 0 && (
        <div
          ref={listRef}
          role="listbox"
          className={`absolute left-0 right-0 z-50 max-h-56 overflow-y-auto bg-white rounded-xl shadow-xl shadow-[#0E113C]/12 border border-[#E2E8F0] py-1 ${
            placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } ${menuClassName}`}
        >
          {filteredOptions.map((opt, index) => {
            const isSelected =
              String(opt.value).toLowerCase() === String(value).toLowerCase();
            const isHighlighted = highlightedIndex === index;

            return (
              <button
                key={`${opt.value}-${index}`}
                type="button"
                role="option"
                data-combobox-option
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevents input blur before select executes
                  handleSelect(opt);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`w-full px-3.5 py-2 text-xs transition-colors flex items-center justify-between cursor-pointer text-left ${
                  isSelected
                    ? 'bg-[#0E113C] text-white font-bold'
                    : isHighlighted
                    ? 'bg-[#FFF8EB] text-[#0E113C] font-semibold'
                    : 'text-[#0E113C] hover:bg-[#FFF8EB] font-medium'
                }`}
              >
                <div className="truncate flex-1 pr-2">
                  <span>{opt.label}</span>
                  {opt.subtext && (
                    <span
                      className={`ml-2 text-[10px] ${
                        isSelected ? 'text-gray-300' : 'text-[#5A627A]'
                      }`}
                    >
                      {opt.subtext}
                    </span>
                  )}
                </div>
                {isSelected && (
                  <Check
                    className="w-3.5 h-3.5 text-[#FBA920] shrink-0 ml-1.5"
                    strokeWidth={2.8}
                  />
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
