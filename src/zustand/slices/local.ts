import { LocalStore, PreferencesDefaults } from "@/types/zustand/local";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { deepMerge } from "@/utils/other/merge";

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
                contactMessages: "expanded",
            },
            messages: {
                archive: {
                    collapsed: false,
                    movedToMenu: false,
                },
            },
        },
        theme: "dark",

        updateDisplay: (display) => {
            set((state) => ({
                ...state,
                display: deepMerge(state.display, display),
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
