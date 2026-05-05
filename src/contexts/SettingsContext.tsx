// src/contexts/SettingsContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import type { GroupedSettingsData, SettingType, UpdateCategorySettingsData } from "../api/core/system_config";
import systemConfigAPI from "../api/core/system_config";

// State shape
interface SettingsState {
  grouped: GroupedSettingsData | null;
  flat: Record<string, any>; // e.g., "general.company_name" -> value
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
}

type SettingsAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: GroupedSettingsData }
  | { type: "FETCH_ERROR"; payload: string }
  | {
      type: "UPDATE_CATEGORY";
      payload: {
        category: keyof GroupedSettingsData["grouped_settings"];
        data: any;
      };
    }
  | { type: "UPDATE_FLAT"; payload: { key: string; value: any } }
  | { type: "REFRESH" };

const initialState: SettingsState = {
  grouped: null,
  flat: {},
  loading: true,
  error: null,
  lastFetched: null,
};

// Helper to build flat object from grouped settings
const buildFlatSettings = (grouped: GroupedSettingsData): Record<string, any> => {
  const flat: Record<string, any> = {};
  if (!grouped?.grouped_settings) return flat;

  Object.entries(grouped.grouped_settings).forEach(([category, settings]) => {
    if (settings && typeof settings === "object") {
      Object.entries(settings).forEach(([key, value]) => {
        flat[`${category}.${key}`] = value;
      });
    }
  });
  return flat;
};

function settingsReducer(
  state: SettingsState,
  action: SettingsAction
): SettingsState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        grouped: action.payload,
        flat: buildFlatSettings(action.payload),
        loading: false,
        error: null,
        lastFetched: Date.now(),
      };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "UPDATE_CATEGORY":
      if (!state.grouped) return state;
      const updatedGrouped = {
        ...state.grouped,
        grouped_settings: {
          ...state.grouped.grouped_settings,
          [action.payload.category]: {
            ...(state.grouped.grouped_settings[action.payload.category] as object),
            ...action.payload.data,
          },
        },
      };
      return {
        ...state,
        grouped: updatedGrouped,
        flat: buildFlatSettings(updatedGrouped),
      };
    case "UPDATE_FLAT":
      return {
        ...state,
        flat: { ...state.flat, [action.payload.key]: action.payload.value },
      };
    default:
      return state;
  }
}

interface SettingsContextValue {
  settings: SettingsState;
  getSetting: <T = any>(category: string, key: string, defaultValue?: T) => T;
  getCategory: <T = any>(category: string) => T | null;
  updateCategory: (
    category: string,
    data: Record<string, any>
  ) => Promise<void>;
  updateSetting: (
    category: string,
    key: string,
    value: any,
    description?: string
  ) => Promise<void>;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const fetchSettings = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const response = await systemConfigAPI.getGroupedConfig();
      if (response.status && response.data) {
        dispatch({ type: "FETCH_SUCCESS", payload: response.data });
      } else {
        dispatch({
          type: "FETCH_ERROR",
          payload: response.message || "Failed to load settings",
        });
      }
    } catch (err: any) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err.message || "Unknown error",
      });
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const getSetting = useCallback(
    <T = any,>(category: string, key: string, defaultValue?: T): T => {
      const flatKey = `${category}.${key}`;
      return (state.flat[flatKey] as T) ?? (defaultValue as T);
    },
    [state.flat]
  );

  const getCategory = useCallback(
    <T = any,>(category: string): T | null => {
      if (!state.grouped) return null;
      return state.grouped.grouped_settings[
        category as keyof typeof state.grouped.grouped_settings
      ] as T;
    },
    [state.grouped]
  );

  const updateCategory = useCallback(
    async (category: string, data: Record<string, any>) => {
      try {
        const payload: UpdateCategorySettingsData = { [category]: data };
        const response = await systemConfigAPI.updateGroupedConfig(payload);
        if (response.status && response.data) {
          dispatch({
            type: "UPDATE_CATEGORY",
            payload: { category: category as any, data },
          });
        } else {
          await fetchSettings();
          throw new Error(response.message || "Update failed");
        }
      } catch (err) {
        console.error("Failed to update category settings:", err);
        throw err;
      }
    },
    [fetchSettings]
  );

  const updateSetting = useCallback(
    async (category: string, key: string, value: any, description?: string) => {
      try {
        const flatKey = `${category}.${key}`;
        const response = await systemConfigAPI.setValueByKey(flatKey, value, {
          setting_type: category as SettingType,
          description,
          isPublic: false,
        });
        if (response.status) {
          dispatch({
            type: "UPDATE_FLAT",
            payload: { key: flatKey, value },
          });
          // Also update grouped state optimistically
          if (
            state.grouped?.grouped_settings[
              category as keyof typeof state.grouped.grouped_settings
            ]
          ) {
            dispatch({
              type: "UPDATE_CATEGORY",
              payload: {
                category: category as any,
                data: { [key]: value },
              },
            });
          }
        } else {
          await fetchSettings();
          throw new Error(response.message || "Update failed");
        }
      } catch (err) {
        console.error("Failed to update setting:", err);
        throw err;
      }
    },
    [fetchSettings, state.grouped]
  );

  const refreshSettings = useCallback(async () => {
    await fetchSettings();
  }, [fetchSettings]);

  const value: SettingsContextValue = {
    settings: state,
    getSetting,
    getCategory,
    updateCategory,
    updateSetting,
    refreshSettings,
  };

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
};