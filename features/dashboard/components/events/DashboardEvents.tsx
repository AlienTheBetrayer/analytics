import { protectedRequest } from "@/app/utils/protectedRequest";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import { useSessionStore } from "@/zustand/sessionStore";
import { useNotificationContext } from "../../context/NotificationContext";
import type { useData } from "../../hooks/useData";
import { DashboardEventList } from "./DashboardEventList";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardEvents = ({ controller }: Props) => {
	// zustand
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

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
					<div className="flex relative gap-2 flex-wrap">
						<div className="flex gap-2">
							<h3 className="sm:absolute whitespace-nowrap sm:left-1/2 sm:top-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2">
								Events (<mark>{projectData.project.name}</mark>)
							</h3>

							<Tooltip description="Wipe" direction="top">
								<Button isEnabled={isLoggedIn}>
									<small>Delete project</small>
								</Button>
							</Tooltip>
						</div>

						<div className="flex gap-2 ml-auto">
							<Tooltip
								description="Wipe all events"
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
					</div>

					<DashboardEventList
						projectData={projectData}
						controller={controller}
						notifications={notifications}
						promises={promises}
					/>
				</>
			) : (
				<span className="m-auto span-animated">No events so far...</span>
			)}
		</div>
	) : (
		<span className="m-auto span-animated">
			Select a project to see events.
		</span>
	);
};
