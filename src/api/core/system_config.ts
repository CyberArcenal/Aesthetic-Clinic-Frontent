// src/api/core/system_config.ts

export type SettingType =
  | "general"
  | "clinic"
  | "notifications"
  | "appointments"
  | "billing"
  | "staff";

export interface Setting {
  id: number;
  key: string;
  value: any;
  setting_type: SettingType;
  description?: string;
  is_public?: boolean;
  created_at: string;
  updated_at: string;
}

export interface GroupedSettingsData {
  grouped_settings: {
    general: GeneralSettings;
    clinic: ClinicSettings;
    notifications: NotificationSettings;
    appointments: AppointmentSettings;
    billing: BillingSettings;
    staff: StaffSettings;
  };
  settings: Setting[];
}

export interface GeneralSettings {
  company_name: string;
  timezone: string;
  date_format: string;
  time_format: string;
  currency: string;
  language: string;
}
export interface ClinicSettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  logo_url: string;
  working_hours_weekday: string;
  working_hours_weekend: string;
}

export interface NotificationSettings {
  enable_email: boolean;
  enable_sms: boolean;
  email_from: string;
  sms_provider: string;
}

export interface AppointmentSettings {
  default_duration: number;
  buffer_between: number;
  allow_online_booking: boolean;
  cancellation_window_hours: number;
}

export interface BillingSettings {
  tax_rate: number;
  invoice_prefix: string;
  payment_terms_days: number;
  enable_late_fee: boolean;
  late_fee_percent: number;
}

export interface StaffSettings {
  require_shift_assignment: boolean;
  default_role: string;
}

export interface UpdateCategorySettingsData {
  [category: string]: Record<string, any>;
}

// Hardcoded data for now – replace with real API calls later
const HARDCODED_SETTINGS: GroupedSettingsData = {
  grouped_settings: {
    general: {
      company_name: "Aesthetic Wellness Clinic",
      timezone: "Asia/Manila",
      date_format: "MM/DD/YYYY",
      time_format: "12h",
      currency: "PHP",
      language: "en",
    },
    clinic: {
      name: "Aesthetic Wellness Clinic",
      address: "123 Health St., Makati City, Philippines",
      phone: "+63 2 1234 5678",
      email: "info@aestheticclinic.com",
      logo_url: "/logo.png",
      working_hours_weekday: "9:00 AM – 6:00 PM",
      working_hours_weekend: "10:00 AM – 4:00 PM",
    },
    notifications: {
      enable_email: true,
      enable_sms: true,
      email_from: "noreply@aestheticclinic.com",
      sms_provider: "Twilio",
    },
    appointments: {
      default_duration: 60,
      buffer_between: 15,
      allow_online_booking: true,
      cancellation_window_hours: 24,
    },
    billing: {
      tax_rate: 12,
      invoice_prefix: "INV-",
      payment_terms_days: 30,
      enable_late_fee: true,
      late_fee_percent: 5,
    },
    staff: {
      require_shift_assignment: true,
      default_role: "Staff",
    },
  },
  settings: [],
};

class SystemConfigAPI {
  async getGroupedConfig(): Promise<{
    status: boolean;
    data?: GroupedSettingsData;
    message?: string;
  }> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { status: true, data: HARDCODED_SETTINGS };
  }

  async updateGroupedConfig(payload: UpdateCategorySettingsData): Promise<{
    status: boolean;
    data?: GroupedSettingsData;
    message?: string;
  }> {
    // Merge updates into hardcoded data (simulate update)
    for (const [category, updates] of Object.entries(payload)) {
      if (
        HARDCODED_SETTINGS.grouped_settings[
          category as keyof typeof HARDCODED_SETTINGS.grouped_settings
        ]
      ) {
        Object.assign(
          HARDCODED_SETTINGS.grouped_settings[
            category as keyof typeof HARDCODED_SETTINGS.grouped_settings
          ],
          updates,
        );
      }
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
    return { status: true, data: HARDCODED_SETTINGS };
  }

  async setValueByKey(
    key: string,
    value: any,
    options?: {
      setting_type?: SettingType;
      description?: string;
      isPublic?: boolean;
    },
  ): Promise<{ status: boolean; data?: Setting; message?: string }> {
    // Find or create setting in the flat list (but we don't store flat in hardcoded; we'll just simulate)
    await new Promise((resolve) => setTimeout(resolve, 200));
    // For demo, we also update the grouped structure if needed
    // Parse key: e.g., "general.company_name"
    const parts = key.split(".");
    if (
      parts.length === 2 &&
      HARDCODED_SETTINGS.grouped_settings[
        parts[0] as keyof typeof HARDCODED_SETTINGS.grouped_settings
      ]
    ) {
      (
        HARDCODED_SETTINGS.grouped_settings[
          parts[0] as keyof typeof HARDCODED_SETTINGS.grouped_settings
        ] as any
      )[parts[1]] = value;
    }
    return {
      status: true,
      data: {
        id: Date.now(),
        key,
        value,
        setting_type: options?.setting_type || "general",
        description: options?.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    };
  }
}

const systemConfigAPI = new SystemConfigAPI();
export default systemConfigAPI;
