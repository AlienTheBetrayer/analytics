import type { ProjectData } from "../hooks/useData";

export type DataAction =
	| { type: "SET_DATA"; data: ProjectData[] | null }
	| { type: "DELETE_EVENT"; id: string };

export const DataReducer = (
	state: ProjectData[] | null,
	action: DataAction,
): ProjectData[] | null => {
	switch (action.type) {
		case "SET_DATA":
			return action.data;
		case "DELETE_EVENT": {
			if (state === null) return state;

			return state.map((data) => ({
				...data,
				metaData: data.metaData.filter((metaData) => metaData.id !== action.id),
			}));
		}
	}
};
