// profile / authentication optimization
export type VisibleProfile = {
    username: string;
    avatar_url?: string;
    color?: string;
};

// preferences
export type Preferences = {
    visibility: boolean;
};
export const PreferencesDefaults: Preferences = {
    visibility: true,
};

// display
export type SortingDirection = "ascendant" | "descendant";
export type Sorting = {
    posts: SortingDirection;
};
export type ViewPostColumns = "1" | "2" | "3" | "4";
export type View = {
    postsColumns: ViewPostColumns;
};

export type Display = {
    sorting: Sorting;
    view: View;
};

export type LocalStore = {
    // settings
    preferences: Preferences;

    // profiles
    visibleProfile?: VisibleProfile;

    // theme
    theme: "dark" | "light";

    // display
    display: Display;

    /**
     * toggles the theme (goes from dark to light to dark)
     */
    toggleTheme: () => void;

    /**
     * sets the visible profile (no authentication flicker)
     * @param profile the profile
     */
    setVisibleProfile: (visibleProfile?: VisibleProfile) => void;

    /**
     * updates the sorting metadata
     * @param sorting a partial sorting object
     */
    updateDisplay: (sorting: Partial<Display>) => void;

    /**
     * toggles the sorting metadata
     * @param sorting a partial sorting object
     */
    toggleSorting: (key: keyof Sorting) => void;

    /**
     * updates the preferences (don't provide a value if you want it unchanged)
     * @param preferences a partial preferences object
     */
    updatePreferences: (preferences: Partial<Preferences>) => void;

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
