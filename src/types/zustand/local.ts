// authentication optimization
export type VisibleProfile = {
    username: string;
    avatar_url?: string;
    color?: string;
};

export type Preferences = {
    visibility: boolean;
}

export const PreferencesDefaults: Preferences = {
    visibility: true,
}

export type LocalStore = {
    // settings
    preferences: Preferences;

    // profiles
    visibleProfile?: VisibleProfile;

    // theme
    theme: "dark" | "light";

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
