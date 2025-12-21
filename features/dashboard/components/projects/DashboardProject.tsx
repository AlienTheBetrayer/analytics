import { protectedRequest } from "@/app/utils/protectedRequest";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import { relativeTime } from "@/utils/relativeTime";
import { useSessionStore } from "@/zustand/sessionStore";
import Image from "next/image";
import linkImg from "../../../../public/link.svg";
import { useNotificationContext } from "../../context/NotificationContext";
import type { ProjectData, useData } from "../../hooks/useData";

type Props = {
	projectData: ProjectData;
	controller: ReturnType<typeof useData>;
};

export const DashboardProject = ({ projectData, controller }: Props) => {
	// zustand
	const isLoggedIn = useSessionStore((state) => state.isLoggedIn);

	// spinner handling
	const promises = usePromiseStatus();

	// notifications api
	const notifications = useNotificationContext();

	// message box
	const deleteProjectMessageBox = usePopup(
		<MessageBox
			title="Are you sure?"
			description="You are about to delete all data about this project!"
			onInteract={(res) => {
				if (res === "yes" && projectData !== undefined) {
					promises.wrap("project", () =>
						protectedRequest("/api/analytics/admin/delete-project", {
							project_id: projectData.project.id,
						})
							.then(() => {
								controller.dispatch({
									type: "DELETE_PROJECT",
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
				}
				deleteProjectMessageBox.hide();
			}}
		/>,
	);

	return (
		<Tooltip
			description={`View events`}
			direction="top"
			element={
				<Tooltip
					description="Delete this project"
					direction="top"
					isEnabled={isLoggedIn !== false && isLoggedIn.role === "admin"}
				>
					<Button
						isEnabled={isLoggedIn !== false && isLoggedIn.role === "admin"}
						onClick={() => {
							deleteProjectMessageBox.show();
						}}
					>
						Delete
					</Button>
				</Tooltip>
			}
			title={projectData.project.name}
		>
			{deleteProjectMessageBox.render()}

			<li className="w-full">
				<Button
					className="w-full project-button"
					onClick={() =>
						controller.setSelectedProjectId(projectData.project.id)
					}
				>
					<div className="flex items-center gap-1.5">
						{promises.get("project") === "pending" && <Spinner />}
						<Image
							src={linkImg}
							alt=""
							className={`image ${controller.selectedProjectId === projectData.project.id ? "invert-100!" : ""}`}
						/>
						<span>{projectData.project.name}</span>
					</div>

					<span
						style={{
							opacity:
								controller.selectedProjectId === projectData.project.id
									? 1
									: 0.3,
						}}
						className={`transition-all duration-300 text-left events-span`}
					>
						<small className="text-3xl!">{projectData.metaData.length}</small>
						<small> events</small>
					</span>

					<span
						style={{
							opacity:
								controller.selectedProjectId === projectData.project.id
									? 1
									: 0.3,
						}}
						className={`transition-all duration-300 text-left`}
					>
						<small className="text-3xl!">
							{projectData?.aggregates.visits ?? 0}
						</small>
						<small> visits</small>
					</span>

					<span className="text-right">
						{relativeTime(projectData.project.created_at)}
					</span>
				</Button>
			</li>
		</Tooltip>
	);
};
