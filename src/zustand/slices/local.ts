import {
    LocalStore,
    PreferencesDefaults, VisibleProfile
} from "@/types/zustand/local";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const LocalSlice: SliceFunction<LocalStore, LocalStore> = (set) => {
    return {
        preferences: {
            visibility: true,
        },
        sorting: {
            posts: "descendant",
        },
        theme: "dark",

        updateSorting: (sorting) => {
            set((state) => ({
                ...state,
                sorting: { ...state.sorting, ...sorting },
            }));
        },

        toggleSorting: (key) => {
            set(state => ({ ...state, sorting: { ...state.sorting, [key]: state.sorting[key] === "ascendant" ? "descendant" : "ascendant"} }));
        },
        

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
