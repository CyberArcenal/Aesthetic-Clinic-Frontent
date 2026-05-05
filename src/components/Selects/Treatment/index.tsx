// src/components/Selects/Treatment/index.tsx
import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Search, ChevronDown, Stethoscope, X } from "lucide-react";
import treatmentApi, { TreatmentResponseDto } from "@/api/core/treatment";
import debounce from "@/utils/debounce";
import { formatCurrency } from "@/utils/formatters";

interface TreatmentSelectProps {
  value: number | null;
  onChange: (treatmentId: number | null, treatment?: TreatmentResponseDto) => void;
  disabled?: boolean;
  placeholder?: string;
  activeOnly?: boolean;
  className?: string;
}

const TreatmentSelect: React.FC<TreatmentSelectProps> = ({
  value,
  onChange,
  disabled = false,
  placeholder = "Select treatment...",
  activeOnly = true,
  className = "w-full max-w-md",
}) => {
  const [treatments, setTreatments] = useState<TreatmentResponseDto[]>([]);
  const [filteredTreatments, setFilteredTreatments] = useState<TreatmentResponseDto[]>([]);
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
        setFilteredTreatments(treatments);
        return;
      }
      setLoading(true);
      try {
        const res = await treatmentApi.getTreatments({ page: 1, pageSize: 20, search: term });
        if (res.success) {
          setFilteredTreatments(res.data.items);
        } else {
          setFilteredTreatments([]);
        }
      } catch {
        setFilteredTreatments([]);
      } finally {
        setLoading(false);
      }
    }, 300)
  ).current;

  // Initial load
  useEffect(() => {
    const loadTreatments = async () => {
      setLoading(true);
      try {
        const params: any = { page: 1, pageSize: 1000 };
        if (activeOnly) params.active = true; // backend may support is_active filter
        const res = await treatmentApi.getTreatments(params);
        if (res.success) {
          setTreatments(res.data.items);
          setFilteredTreatments(res.data.items);
        }
      } catch (error) {
        console.error("Failed to load treatments:", error);
      } finally {
        setLoading(false);
      }
    };
    loadTreatments();
  }, [activeOnly]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTreatments(treatments);
    } else {
      debouncedSearch(searchTerm);
    }
    return () => debouncedSearch.cancel?.();
  }, [searchTerm, treatments, debouncedSearch]);

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

  const handleSelect = (treatment: TreatmentResponseDto) => {
    onChange(treatment.id, treatment);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  const selectedTreatment = treatments.find((t) => t.id === value);

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
        <Stethoscope
          className="w-4 h-4 flex-shrink-0"
          style={{ color: "var(--primary-color)" }}
        />
        <div className="flex-1 min-w-0 flex items-center gap-2">
          {selectedTreatment ? (
            <>
              <span className="font-medium truncate">{selectedTreatment.name}</span>
              {selectedTreatment.price !== undefined && (
                <span className="text-xs truncate" style={{ color: "var(--accent-green)" }}>
                  {formatCurrency(selectedTreatment.price)}
                </span>
              )}
            </>
          ) : (
            <span className="truncate" style={{ color: "var(--text-secondary)" }}>
              {placeholder}
            </span>
          )}
        </div>
        {selectedTreatment && !disabled && (
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
                  placeholder="Search by name or category..."
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
              {loading && treatments.length === 0 ? (
                <div className="p-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  Loading...
                </div>
              ) : filteredTreatments.length === 0 ? (
                <div className="p-3 text-center text-sm" style={{ color: "var(--text-secondary)" }}>
                  No treatments found
                </div>
              ) : (
                filteredTreatments.map((treatment) => (
                  <button
                    key={treatment.id}
                    type="button"
                    onClick={() => handleSelect(treatment)}
                    className={`
                      w-full px-3 py-2 text-left flex items-center gap-2
                      transition-colors text-sm cursor-pointer hover:bg-[var(--card-hover-bg)]
                      ${treatment.id === value ? "bg-[var(--accent-blue-light)]" : ""}
                    `}
                    style={{ borderBottom: "1px solid var(--border-color)" }}
                  >
                    <Stethoscope
                      className="w-3.5 h-3.5 flex-shrink-0"
                      style={{ color: "var(--primary-color)" }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className="font-medium truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {treatment.name}
                        </span>
                        {treatment.category && (
                          <span
                            className="text-xs truncate"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {treatment.category}
                          </span>
                        )}
                      </div>
                      <div className="flex justify-between items-center mt-0.5">
                        <span className="text-xs" style={{ color: "var(--accent-green)" }}>
                          {formatCurrency(treatment.price)}
                        </span>
                        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
                          {treatment.durationMinutes} min
                        </span>
                      </div>
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

export default TreatmentSelect;