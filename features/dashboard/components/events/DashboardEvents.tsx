import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import type { useData } from "../../hooks/useData";
import { DashboardEvent } from "./DashboardEvent";
import axios from "axios";

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
		<div className="flex flex-col gap-4 ">
			{projectData.metaData.length > 0 ? (
				<>
					<div className="flex relative">
						<h3 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							Events (<mark>{projectData.project.name}</mark>)
						</h3>

						<Tooltip
							description="Hide events tab"
							className="ml-auto"
							direction="top"
						>
							<Button onClick={() => controller.setSelectedProjectId(null)}>
								<small>✕ Hide</small>
							</Button>
						</Tooltip>
					</div>

					<ul
						className="flex flex-col gap-2 max-h-64 overflow-y-auto scheme-dark p-2.5!"
						style={{
							maskImage:
								"linear-gradient(to top, transparent 0%, black 15%), linear-gradient(to bottom, trasparent 0%, black 15%)",
							scrollbarWidth: "none",
						}}
					>
						{[...projectData.metaData].reverse().map((metaDataEntry) => (
							<DashboardEvent
								event={metaDataEntry}
								key={metaDataEntry.id}
								onDelete={(id) => {
                                    // controller.dataDispatch({ type: 'DELETE_EVENT', id });
                                    axios.post('api/analytics/type=deleteEvent', { id });
                                }}
							/>
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
