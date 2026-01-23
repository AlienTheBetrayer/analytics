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
        display: {
            sorting: {
                posts: "descendant",
            },
            view: {
                postsColumns: "1",
            },
        },
        theme: "dark",

        updateDisplay: (display) => {
            set((state) => ({
                ...state,
                display: {
                    ...state.display,
                    sorting: {
                        ...state.display.sorting,
                        ...(display?.sorting ?? {}),
                    },
                    view: { ...state.display.view, ...(display?.view ?? {}) },
                },
            }));
        },

        toggleSorting: (key) => {
            set((state) => ({
                ...state,
                display: {
                    ...state.display,
                    sorting: {
                        ...state.display.sorting,
                        [key]:
                            state.display.sorting[key] === "ascendant"
                                ? "descendant"
                                : "ascendant",
                    },
                },
            }));
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
