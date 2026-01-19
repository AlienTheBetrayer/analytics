import {
    LocalStore,
    PreferencesDefaults,
    VisibleProfile,
} from "@/types/zustand/local";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const LocalSlice: SliceFunction<LocalStore, LocalStore> = (set) => {
    return {
        preferences: {
            visibility: true,
        },
        theme: "dark",

        toggleTheme: () => {
            set((state) => ({
                ...state,
                theme: state.theme === "dark" ? "light" : "dark",
            }));
        },

        setVisibleProfile: (visibleProfile?: VisibleProfile) => {
            set((state) => ({ ...state, visibleProfile }));
        },

        updatePreferences: (options) => {
            set((state) => ({
                ...state,
                preferences: {
                    ...state.preferences,
                    ...options,
                },
            }));
        },

        resetPreferences: () => {
            set((state) => ({ ...state, preferences: PreferencesDefaults }));
        },

        setPreferences: (preferences) => {
            set((state) => ({
                ...state,
                preferences,
            }));
        },
    };
};
