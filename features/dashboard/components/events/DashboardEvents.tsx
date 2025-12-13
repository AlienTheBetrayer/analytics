import { Button } from "@/features/ui/button/components/Button";
import type { useData } from "../../hooks/useData";
import { DashboardEvent } from "./DashboardEvent";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardEvents = ({ controller }: Props) => {
	const projectData =
		controller.data === null
			? undefined
			: controller.data.find(
					(p) => p.project.id === controller.selectedProjectId,
				);

	return controller.selectedProjectId !== null && projectData !== undefined ? (
		<div className="flex flex-col gap-4">
			{projectData.metaData.length > 0 ? (
				<>
					<div className="flex relative min-h-8">
						<h3 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							Events (<mark>{projectData.project.name}</mark>)
						</h3>

						<Button
							className="ml-auto"
							onClick={() => controller.setSelectedProjectId(null)}
						>
							<small>✕ Go back</small>
						</Button>
					</div>
					<ul className="flex flex-col gap-2">
						{projectData.metaData.map((metaDataEntry) => (
							<DashboardEvent event={metaDataEntry} key={metaDataEntry.id} />
						))}
					</ul>
				</>
			) : (
				<span className="m-auto">No events so far...</span>
			)}
		</div>
	) : (
		<span className="m-auto">Select a project to see events</span>
	);
};
