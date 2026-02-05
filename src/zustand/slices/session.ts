import { SessionStore } from "@/types/zustand/session";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const SessionSlice: SliceFunction<SessionStore, SessionStore> = (
    set,
) => {
    return {
        animations: {
            header: false,
        },

        updateAnimations: (animations) => {
            set((state) => ({
                ...state,
                animations: { ...state.animations, ...animations },
            }));
        },
    };
};
