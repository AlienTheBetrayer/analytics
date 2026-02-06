// helper type
type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends (infer U)[]
        ? DeepPartial<U>[]
        : T[P] extends object
          ? DeepPartial<T[P]>
          : T[P];
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
export type ContactMessages = "compact" | "expanded";

export type View = {
    postsColumns: ViewPostColumns;
    contactMessages: ContactMessages;
};

export type Display = {
    sorting: Sorting;
    view: View;
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
     * updates the sorting metadata
     * @param sorting a partial sorting object
     */
    updateDisplay: (sorting: DeepPartial<Display>) => void;

    /**
     * toggles the sorting metadata
     * @param sorting a partial sorting object
     */
    toggleSorting: (key: keyof Sorting) => void;

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
