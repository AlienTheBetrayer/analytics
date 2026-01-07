import {
    LocalStore,
    ProfileMenuType,
    VisibleProfile,
} from "@/types/zustand/local";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const LocalSlice: SliceFunction<LocalStore, LocalStore> = (set) => {
    return {
        profilesMenuType: "desktop",

        setProfilesMenuType: (type: ProfileMenuType) => {
            set((state) => ({ ...state, profilesMenuType: type }));
        },

        setVisibleProfile: (visibleProfile?: VisibleProfile) => {
            set((state) => ({ ...state, visibleProfile }));
        },
    };
};
