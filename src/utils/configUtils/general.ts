// src/utils/general.ts
// Utility functions and hooks for general settings (matching GeneralSettings in system_config)

import { useSettings } from "../../contexts/SettingsContext";

/**
 * Format a date according to the stored date_format setting.
 */
export const formatDateBySetting = (date: Date, format?: string): string => {
  // Placeholder – you can implement with date-fns or similar.
  return date.toLocaleDateString();
};

/**
 * Format time according to the stored time_format setting (12h or 24h).
 */
export const formatTimeBySetting = (date: Date, format?: string): string => {
  // Placeholder – implement based on time_format.
  return date.toLocaleTimeString();
};

// ============================================================================
// Hooks for General Settings (only fields defined in GeneralSettings)
// ============================================================================

export const useCompanyName = (): string => {
  const { getSetting } = useSettings();
  return getSetting<string>("general", "company_name", "Aesthetic Clinic");
};

export const useTimezone = (): string => {
  const { getSetting } = useSettings();
  return getSetting<string>("general", "timezone", "Asia/Manila");
};

export const useDateFormat = (): string => {
  const { getSetting } = useSettings();
  return getSetting<string>("general", "date_format", "MM/DD/YYYY");
};

export const useTimeFormat = (): string => {
  const { getSetting } = useSettings();
  return getSetting<string>("general", "time_format", "12h");
};

export const useCurrency = (): string => {
  const { getSetting } = useSettings();
  return getSetting<string>("general", "currency", "PHP");
};

export const useLanguage = (): string => {
  const { getSetting } = useSettings();
  return getSetting<string>("general", "language", "en");
};

// Full general settings object
export const useGeneralSettings = () => {
  const { getSetting } = useSettings();
  return {
    company_name: getSetting<string>("general", "company_name", "Aesthetic Clinic"),
    timezone: getSetting<string>("general", "timezone", "Asia/Manila"),
    date_format: getSetting<string>("general", "date_format", "MM/DD/YYYY"),
    time_format: getSetting<string>("general", "time_format", "12h"),
    currency: getSetting<string>("general", "currency", "PHP"),
    language: getSetting<string>("general", "language", "en"),
  };
};