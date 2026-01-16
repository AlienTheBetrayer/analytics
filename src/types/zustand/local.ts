// authentication optimization
export type VisibleProfile = {
    username: string;
    avatar_url?: string;
    color?: string;
};

export type LocalStore = {
    // settings
    preferences: {
        visibility: boolean;
    };

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
     * @param visibility whether to show the notifications' popups
     */
    updatePreferences: (options: { visibility?: boolean }) => void;
};
