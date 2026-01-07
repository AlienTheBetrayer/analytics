import type { DashboardStore } from "@/types/zustand/dashboard";
import type { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const DashboardSlice: SliceFunction<DashboardStore> = (set, get) => {
    return {
        notifications: [],
        eventFilters: {},

        selectProject: (idx: string | undefined) => {
            const { selectedProjectId } = get();
            if (selectedProjectId === idx) {
                return;
            }

            set((state) => ({ ...state, selectedProjectId: idx }));
        },

        deselectProject: () => {
            const { selectedProjectId } = get();
            if (selectedProjectId === undefined) {
                return;
            }

            set((state) => ({ ...state, selectedProjectId: undefined }));
        },

        setEventFilters: (options) => {
            set((state) => {
                if (!options.events.length) {
                    return state;
                }

                const eventFilters = { ...state.eventFilters };

                for (const event of options.events) {
                    eventFilters[event] = options.flag;
                }

                return { ...state, eventFilters };
            });
        },

        setNotifications: (notifications) => {
            set((state) => ({ ...state, notifications }));
        },

        pushNotification: (notification) => {
            set((state) => ({
                ...state,
                notifications: [...state.notifications, notification],
            }));
        },

        clearNotifications: () => {
            set((state) => ({ ...state, notifications: [] }));
        },
    };
};
