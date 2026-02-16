import { DeepPartial } from "@/utils/other/merge";

// preferences
export type Preferences = {
    visibility: boolean;
};
export const PreferencesDefaults: Preferences = {
    visibility: true,
};

// display
export type Display = {
    sorting: {
        posts: "ascendant" | "descendant";
    };
    view: {
        postsColumns: "1" | "2" | "3" | "4";
        contactMessages: "compact" | "expanded";
    };
    messages: {
        archive: {
            collapsed: boolean;
            movedToMenu: boolean;
        };
        noteboard: {
            view: "compact" | "expanded";
        };
    };
};

export type LocalStore = {
    // settings
    preferences: Preferences;

    // theme
    theme: "dark" | "light";

    // display
    display: Display;

    /**
     * toggles the theme (goes from dark to light to dark)
     */
    toggleTheme: () => void;

    /**
     * updates the display data
     * @param display a deep partial display object
     */
    updateDisplay: (display: DeepPartial<Display>) => void;

    /**
     * toggles the sorting metadata
     * @param sorting a partial sorting object
     */
    toggleSorting: (key: keyof Display["sorting"]) => void;

    /**
     * updates the preferences (don't provide a value if you want it unchanged)
     * @param preferences a partial preferences object
     */
    updatePreferences: (preferences: DeepPartial<Preferences>) => void;

    /**
     * explicitly updates the preferences object
     * @param preferences a full references object
     */
    setPreferences: (preferences: Preferences) => void;

    /**
     * resets the preferences object
     */
    resetPreferences: () => void;
};
