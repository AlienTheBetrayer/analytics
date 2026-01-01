import {
    ProfileMenuType,
    UIStore,
    VisibleProfile,
} from "@/types/zustand/local/ui";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";
import { LocalStoreType } from "@/zustand/localStore";

export const UISlice: SliceFunction<UIStore, LocalStoreType> = (set) => {
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
