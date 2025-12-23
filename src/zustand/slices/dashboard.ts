import type { DashboardStore } from "@/src/types/zustand/dashboard";
import type { SliceFunction } from "@/src/types/zustand/utils/sliceFunction";

export const DashboardSlice: SliceFunction<DashboardStore> = (set, get) => {
	return {
		// selectedProject
		selectedProjectId: null,

		selectProject: (idx: string | null) => {
			const { selectedProjectId } = get();
			if (selectedProjectId === idx) {
				return;
			}

			set((state) => ({ ...state, selectedProjectId: idx }));
		},

		deselectProject: () => {
			const { selectedProjectId } = get();
			if (selectedProjectId === null) {
				return;
			}

			set((state) => ({ ...state, selectedProjectId: null }));
		},

		// notifications
		notifications: [],

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
