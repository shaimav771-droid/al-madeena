import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

/**
 * DriveDesk Custom Themed Select Component
 * - Replaces native browser OS dropdown with DriveDesk design system theme (#0E113C Navy & #FBA920 Amber)
 * - Supports options array (strings or { value, label, subtext }) OR child <option> tags
 * - Auto-detects available vertical space to open downward or upward
 * - Accessible keyboard navigation (Up, Down, Enter, Escape, Tab)
 * - Search filter for long option lists (optional or auto)
 */
export default function CustomSelect({
  value,
  onChange,
  options,
  children,
  placeholder = 'Select an option',
  disabled = false,
  required = false,
  name,
  id,
  className = '',
  containerClassName = '',
  menuClassName = '',
  dropdownPosition = 'auto',
  searchable = false,
  error = false,
  prefix = null,
  size = 'md',
  autoWidth = false,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [placement, setPlacement] = useState('bottom');
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef(null);
  const triggerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  // Normalize options from props or children
  const parsedOptions = useMemo(() => {
    if (Array.isArray(options)) {
      return options.map((opt) => {
        if (typeof opt === 'object' && opt !== null) {
          return {
            value: opt.value ?? opt.label ?? '',
            label: opt.label ?? opt.value ?? '',
            subtext: opt.subtext || null,
            icon: opt.icon || null,
          };
        }
        return {
          value: opt,
          label: String(opt),
          subtext: null,
          icon: null,
        };
      });
    }

    // Parse <option> children if options prop was omitted
    if (children) {
      const extracted = [];
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          extracted.push({
            value: child.props.value ?? child.props.children ?? '',
            label: child.props.children ?? child.props.value ?? '',
            subtext: child.props['data-subtext'] || null,
            icon: null,
          });
        }
      });
      return extracted;
    }

    return [];
  }, [options, children]);

  // Determine current selected item label
  const selectedOption = useMemo(() => {
    if (value === undefined || value === null || value === '') return null;
    return parsedOptions.find((opt) => String(opt.value) === String(value)) || null;
  }, [parsedOptions, value]);

  // Filter options if searchable
  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return parsedOptions;
    const q = searchQuery.toLowerCase().trim();
    return parsedOptions.filter(
      (opt) =>
        String(opt.label).toLowerCase().includes(q) ||
        (opt.subtext && String(opt.subtext).toLowerCase().includes(q))
    );
  }, [parsedOptions, searchQuery]);

  // Calculate opening direction (top or bottom)
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

      // If less than 220px below and more space above, open upward
      if (spaceBelow < 220 && spaceAbove > spaceBelow) {
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
      setSearchQuery('');
      // Find initial highlighted index
      const curIdx = parsedOptions.findIndex((opt) => String(opt.value) === String(value));
      setHighlightedIndex(curIdx >= 0 ? curIdx : 0);
    }
    setIsOpen((prev) => !prev);
  };

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on resize or scroll of parent to keep positioned properly
  useEffect(() => {
    if (!isOpen) return;

    function handleWindowEvents() {
      updatePlacement();
    }
    window.addEventListener('resize', handleWindowEvents);
    return () => window.removeEventListener('resize', handleWindowEvents);
  }, [isOpen]);

  // Focus search input when opened if searchable
  useEffect(() => {
    if (isOpen && (searchable || parsedOptions.length > 8) && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen, searchable, parsedOptions.length]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listRef.current) {
      const items = listRef.current.querySelectorAll('[data-select-option]');
      if (items[highlightedIndex]) {
        items[highlightedIndex].scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (opt) => {
    if (disabled) return;
    setIsOpen(false);
    if (onChange) {
      // Provide synthetic event so existing e.target.value code works seamlessly
      const syntheticEvent = {
        target: { name: name || id || '', value: opt.value },
        currentTarget: { name: name || id || '', value: opt.value },
        preventDefault: () => {},
        stopPropagation: () => {},
      };
      onChange(syntheticEvent, opt.value);
    }
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleToggle();
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      triggerRef.current?.focus();
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
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
        triggerRef.current?.focus();
      }
    } else if (e.key === 'Tab') {
      setIsOpen(false);
    }
  };

  const isFilterActive = searchable || parsedOptions.length > 8;

  const sizeClasses =
    size === 'sm'
      ? 'px-3 py-1.5 text-xs rounded-xl'
      : 'px-3.5 py-2.5 text-sm rounded-xl';

  return (
    <div
      ref={containerRef}
      className={`relative ${autoWidth ? 'w-auto inline-block' : 'w-full'} ${containerClassName}`}
      onKeyDown={handleKeyDown}
    >
      {/* Hidden input for form submission if required */}
      {name && (
        <input
          type="hidden"
          name={name}
          value={value ?? ''}
          required={required}
          readOnly
        />
      )}

      {/* Select Trigger Box */}
      <button
        type="button"
        ref={triggerRef}
        id={id}
        disabled={disabled}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-required={required}
        className={`w-full flex items-center justify-between gap-2 bg-white border text-left font-semibold transition-all duration-150 cursor-pointer select-none shadow-xs ${sizeClasses} ${
          isOpen
            ? 'border-[#FBA920] ring-2 ring-[#FBA920]/25 text-[#0E113C]'
            : error
            ? 'border-red-500 text-[#0E113C] focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20'
            : 'border-[#E2E8F0] text-[#0E113C] hover:border-[#0E113C]/40 focus:border-[#FBA920] focus:ring-2 focus:ring-[#FBA920]/20'
        } ${disabled ? 'opacity-60 cursor-not-allowed bg-gray-50' : ''} ${className}`}
      >
        <span className="truncate flex-1 flex items-center">
          {prefix && (
            <span className="text-[#5A627A] font-medium mr-1.5 shrink-0 select-none">
              {prefix}
            </span>
          )}
          {selectedOption ? (
            <span className="text-[#0E113C] font-bold truncate">{selectedOption.label}</span>
          ) : (
            <span className="text-[#94A3B8] font-normal truncate">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={`w-3.5 h-3.5 text-[#5A627A] shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-[#0E113C]' : ''
          }`}
        />
      </button>

      {/* Themed Dropdown Pop-Up Card */}
      {isOpen && (
        <div
          role="listbox"
          id={id ? `${id}-menu` : undefined}
          className={`absolute left-0 z-50 bg-white rounded-xl shadow-xl shadow-[#0E113C]/12 border border-[#E2E8F0] p-1.5 overflow-hidden transition-all duration-150 animate-in fade-in-50 min-w-full w-max max-w-xs sm:max-w-sm ${
            placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
          } ${menuClassName}`}
          style={{ minWidth: autoWidth ? '180px' : '100%' }}
        >
          {/* Optional Search Input for Long Lists */}
          {isFilterActive && (
            <div className="p-1 mb-1 border-b border-[#E2E8F0]">
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#94A3B8] absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setHighlightedIndex(0);
                  }}
                  placeholder="Search options..."
                  className="w-full bg-[#F6F8FB] focus:bg-white text-xs text-[#0E113C] pl-8 pr-2.5 py-1.5 rounded-lg border border-[#E2E8F0] focus:outline-none focus:border-[#FBA920] font-medium transition-all"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Options List */}
          <div ref={listRef} className="max-h-60 overflow-y-auto space-y-0.5 custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="px-3.5 py-3 text-xs text-[#94A3B8] text-center font-medium">
                No matching options found
              </div>
            ) : (
              filteredOptions.map((opt, index) => {
                const isSelected = String(opt.value) === String(value);
                const isHighlighted = highlightedIndex === index;

                return (
                  <button
                    key={`${opt.value}-${index}`}
                    type="button"
                    role="option"
                    data-select-option
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 flex items-center justify-between cursor-pointer text-left select-none ${
                      isSelected
                        ? 'bg-[#0E113C] text-white font-bold shadow-xs hover:bg-[#181C54]'
                        : isHighlighted
                        ? 'bg-[#FFF8EB] text-[#0E113C] font-semibold'
                        : 'text-[#0E113C] hover:bg-[#FFF8EB] hover:text-[#0E113C] font-medium'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate flex-1 min-w-0 pr-2">
                      {opt.icon && <span className="shrink-0">{opt.icon}</span>}
                      <span className="truncate">{opt.label}</span>
                      {opt.subtext && (
                        <span
                          className={`text-xs truncate ${
                            isSelected ? 'text-[#CBD5E1]' : 'text-[#94A3B8]'
                          }`}
                        >
                          {opt.subtext}
                        </span>
                      )}
                    </div>

                    {isSelected && (
                      <Check
                        className="w-4 h-4 text-[#FBA920] shrink-0 ml-1.5"
                        strokeWidth={2.8}
                      />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
