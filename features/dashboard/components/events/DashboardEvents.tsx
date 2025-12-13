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
					<h3 className="text-center">
						Events (<mark>{projectData.project.name}</mark>)
					</h3>
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
