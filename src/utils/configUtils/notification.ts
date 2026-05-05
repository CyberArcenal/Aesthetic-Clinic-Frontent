// src/utils/notification.ts
// Pure utility functions for notifications + settings hooks for the clinic theme

import { useSettings } from "../../contexts/SettingsContext";

/**
 * Format a notification message by replacing placeholders like {customer}.
 * @param template - Message template with placeholders in curly braces
 * @param data - Object containing replacement values
 */
export const formatNotificationMessage = (
  template: string,
  data: Record<string, string | number>
): string => {
  return template.replace(/{(\w+)}/g, (_, key) => String(data[key] ?? `{${key}}`));
};

/**
 * Truncate a message to a certain length, appending ellipsis if needed.
 */
export const truncateMessage = (message: string, maxLength: number): string => {
  if (message.length <= maxLength) return message;
  return message.substring(0, maxLength - 3) + "...";
};

// ============================================================================
// Settings hooks – only those defined in NotificationSettings (system_config)
// ============================================================================

export const useEmailEnabled = (): boolean => {
  const { getSetting } = useSettings();
  return getSetting<boolean>("notifications", "enable_email", false);
};

export const useSmsEnabled = (): boolean => {
  const { getSetting } = useSettings();
  return getSetting<boolean>("notifications", "enable_sms", false);
};

export const useEmailFrom = (): string => {
  const { getSetting } = useSettings();
  return getSetting<string>("notifications", "email_from", "");
};

export const useSmsProvider = (): string => {
  const { getSetting } = useSettings();
  return getSetting<string>("notifications", "sms_provider", "");
};

// Full notifications settings object (only the four supported fields)
export const useNotificationsSettings = () => {
  const { getSetting } = useSettings();
  return {
    enable_email: getSetting<boolean>("notifications", "enable_email", false),
    enable_sms: getSetting<boolean>("notifications", "enable_sms", false),
    email_from: getSetting<string>("notifications", "email_from", ""),
    sms_provider: getSetting<string>("notifications", "sms_provider", ""),
  };
};