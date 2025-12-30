export type ProfileMenuType = "desktop" | "mobile" | "compact";

export type UIStore = {
    profilesMenuType: ProfileMenuType;

    /**
     * sets the profile menu's type
     * @param type the new type for the profile menu 
     */
    setProfilesMenuType: (type: ProfileMenuType) => void;
}