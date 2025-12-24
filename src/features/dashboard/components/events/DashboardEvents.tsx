import { Spinner } from "@/features/spinner/components/Spinner";
import { useAppStore } from "@/zustand/store";
import { DashboardEventList } from "./DashboardEventList";

export const DashboardEvents = () => {
	// zustand
	const data = useAppStore((state) => state.data);
	const selectedProjectId = useAppStore((state) => state.selectedProjectId);

	if (selectedProjectId === null) {
		return <span className="m-auto">Select a project to see events.</span>;
	}

	if (data?.[selectedProjectId].events === undefined) {
		return <Spinner styles="big" />;
	}

	if (data[selectedProjectId].events.length === 0) {
		return <span className="m-auto">No events so far...</span>;
	}

	return (
		<div className="flex flex-col gap-4 ">
			<span className="sm:text-center text-5!">
				{data[selectedProjectId].project?.name}
				{"'s"} events
			</span>
			<DashboardEventList events={data[selectedProjectId].events} />
		</div>
	);
};
