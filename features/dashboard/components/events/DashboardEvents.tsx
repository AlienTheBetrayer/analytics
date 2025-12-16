import { protectedRequest } from "@/app/utils/protectedRequest";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import { useLocalStore } from "@/zustand/localStore";
import { useNotificationContext } from "../../context/NotificationContext";
import type { useData } from "../../hooks/useData";
import { DashboardEvent } from "./DashboardEvent";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardEvents = ({ controller }: Props) => {
	// zustand
	const isLoggedIn = useLocalStore((state) => state.isLoggedIn);

	// notifications api
	const notifications = useNotificationContext();

	// data regarding selected project
	const projectData =
		controller.data === null
			? undefined
			: controller.data.find(
					(p) => p.project.id === controller.selectedProjectId,
				);

	// spinner handling
	const promises = usePromiseStatus();

	return controller.selectedProjectId !== null && projectData !== undefined ? (
		<div className="flex flex-col gap-4 ">
			{projectData.metaData.length > 0 ? (
				<>
					<div className="flex relative gap-2">
						<h3 className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
							Events (<mark>{projectData.project.name}</mark>)
						</h3>

						<Tooltip
							description="Wipe all events"
							className="ml-auto"
							direction="top"
							isEnabled={isLoggedIn}
						>
							<Button
								isEnabled={isLoggedIn}
								onClick={() => {
									promises.wrap("events", () =>
										protectedRequest("/api/analytics/delete-events", {
											project_id: projectData.project.id,
										})
											.then(async () => {
												controller.dataDispatch({
													type: "DELETE_EVENTS",
													project_id: projectData.project.id,
												});
											})
											.catch(() => {
												notifications.show(
													{ type: "error", content: "Not authenticated." },
													false,
												);
											}),
									);
								}}
							>
								{promises.get("events") === "pending" && <Spinner />}
								<small>Delete events</small>
							</Button>
						</Tooltip>

						<Tooltip description="Hide events tab" direction="top">
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
							scrollbarWidth: "thin",
						}}
					>
						{[...projectData.metaData].reverse().map((metaDataEntry) => (
							<DashboardEvent
								event={metaDataEntry}
								key={metaDataEntry.id}
								onDelete={(id) => {
									protectedRequest("/api/analytics/delete-event", { id })
										.then(() => {
											controller.dataDispatch({ type: "DELETE_EVENT", id });
										})
										.catch(() => {
											notifications.show(
												{ type: "error", content: "Not authenticated." },

												false,
											);
										});
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
