export type ProfileMenuType = "desktop" | "mobile" | "compact";

export type VisibleProfile = { username: string; avatar?: string, color?: string };

export type UIStore = {
    profilesMenuType: ProfileMenuType;
    visibleProfile?: VisibleProfile;

    /**
     * sets the profile menu's type
     * @param type the new type for the profile menu 
     */
    setProfilesMenuType: (type: ProfileMenuType) => void;

    /**
     * sets the visible profile (no authentication flicker)
     * @param profile the profile
     */
    setVisibleProfile: (visibleProfile?: VisibleProfile) => void;
}