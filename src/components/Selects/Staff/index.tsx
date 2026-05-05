// src/components/Selects/Staff/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, UserCog, X } from "lucide-react";
import staffApi, { StaffResponseDto } from "@/api/core/staff";
import debounce from "@/utils/debounce";


interface StaffSelectProps {
  value: number | null;
  onChange: (staffId: number | null, staff?: StaffResponseDto) => void;
  disabled?: boolean;
  placeholder?: string;
  activeOnly?: boolean;
  className?: string;
}

const StaffSelect: React.FC<StaffSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select staff...",
  activeOnly = true,
  className = "w-full max-w-md",
}) => {
  const [staff, setStaff] = useState<StaffResponseDto[]>([]);
  const [filteredStaff, setFilteredStaff] = useState<StaffResponseDto[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dropdownStyle, setDropdownStyle] = useState({
    top: 0,
    left: 0,
    width: 0,
  });

  const triggerRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useRef(
    debounce(async (term: string) => {
      if (!term.trim()) {
        setFilteredStaff(staff);
        return;
      }
      setLoading(true);
      try {
        const res = await staffApi.getStaff({ page: 1, pageSize: 20, search: term });
        if (res.success) {
          setFilteredStaff(res.data.items);
        } else {
          setFilteredStaff([]);
        }
      } catch {
        setFilteredStaff([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Initial load
  useEffect(() => {
    const loadStaff = async () => {
      setLoading(true);
      try {
        let items: StaffResponseDto[];
        if (activeOnly) {
          const res = await staffApi.getActiveStaff();
          if (res.success) items = res.data;
          else items = [];
        } else {
          const res = await staffApi.getStaff({ page: 1, pageSize: 1000 });
          if (res.success) items = res.data.items;
          else items = [];
        }
        setStaff(items);
        setFilteredStaff(items);
      } catch (error) {
        console.error("Failed to load staff:", error);
      } finally {
        setLoading(false);
      }
    };
    loadStaff();
  }, [activeOnly]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredStaff(staff);
    } else {
      debouncedSearch(searchTerm);
    }
    return () => debouncedSearch.cancel?.();
  }, [searchTerm, staff, debouncedSearch]);

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const updateDropdownPosition = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setDropdownStyle({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateDropdownPosition();
      window.addEventListener("scroll", updateDropdownPosition, true);
      window.addEventListener("resize", updateDropdownPosition);
    }
    return () => {
      window.removeEventListener("scroll", updateDropdownPosition, true);
      window.removeEventListener("resize", updateDropdownPosition);
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (staffMember: StaffResponseDto) => {
    onChange(staffMember.id, staffMember);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const selectedStaff = staff.find((s) => s.id === value);

  return (
    <div className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        disabled={disabled}
        className={`
          w-full px-4 py-2 rounded-lg text-left flex items-center gap-2
          transition-colors duration-200
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-800"}
        `}
        style={{
          backgroundColor: "var(--card-bg)",
          border: "1px solid var(--border-color)",
          color: "var(--text-primary)",
          minHeight: "42px",
        }}
      >
        <UserCog
          className="w-4 h-4 flex-shrink-0"
          style={{ color: "var(--primary-color)" }}
        />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selectedStaff ? (
            <>
              <span className="font-medium truncate">{selectedStaff.name}</span>
              {selectedStaff.position && (
                <span className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                  ({selectedStaff.position})
                </span>
              )}
            </>
          ) : (
            <span className="truncate" style={{ color: "var(--text-secondary)" }}>
              {placeholder}
            </span>
          )}
        </div>
        {selectedStaff && !disabled && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full hover:bg-gray-700 transition-colors flex-shrink-0"
            style={{ color: "var(--text-secondary)" }}
            title="Remove selected"
          >
            <X className="w-4 h-4" />
          </button>
        )}
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 flex-shrink-0 ${
            isOpen ? "rotate-180" : ""
          }`}
          style={{ color: "var(--text-secondary)" }}
        />
      </button>

      {isOpen &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] rounded-lg shadow-lg overflow-hidden"
            style={{
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              width: dropdownStyle.width,
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--border-color)",
              maxHeight: "350px",
            }}
          >
            <div
              className="p-2 border-b"
              style={{ borderColor: "var(--border-color)" }}
            >
              <div className="relative">
                <Search
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4"
                  style={{ color: "var(--text-secondary)" }}
                />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by name or position..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded text-sm"
                  style={{
                    backgroundColor: "var(--card-secondary-bg)",
                    border: "1px solid var(--border-color)",
                    color: "var(--text-primary)",
                  }}
                />
              </div>
            </div>

            <div className="overflow-y-auto" style={{ maxHeight: "250px" }}>
              {loading && staff.length === 0 ? (
                <div className="p-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Loading...
                </div>
              ) : filteredStaff.length === 0 ? (
                <div className="p-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  No staff found
                </div>
              ) : (
                filteredStaff.map((staffMember) => (
                  <button
                    key={staffMember.id}
                    type="button"
                    onClick={() => handleSelect(staffMember)}
                    className={`
                      w-full px-3 py-2 text-left flex items-center gap-2
                      transition-colors text-sm cursor-pointer hover:bg-[var(--card-hover-bg)]
                      ${staffMember.id === value ? "bg-[var(--accent-blue-light)]" : ""}
                    `}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <UserCog
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {staffMember.name}
                        </span>
                        {staffMember.position && (
                          <span
                            className="text-xs truncate"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {staffMember.position}
                          </span>
                        )}
                      </div>
                      {staffMember.email && (
                        <div className="text-xs mt-0.5" style={{ color: "var(--text-secondary)" }}>
                          {staffMember.email}
                        </div>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};

export default StaffSelect;