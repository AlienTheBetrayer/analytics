import "./DashboardProject.css";
import Image from "next/image";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import type { ProjectData } from "@/types/zustand/data";
import { relativeTime } from "@/utils/relativeTime";
import { useAppStore } from "@/zustand/store";

type Props = {
	projectData: ProjectData;
};

export const DashboardProject = ({ projectData }: Props) => {
	// zustand
	const selectedProjectId = useAppStore((state) => state.selectedProjectId);
	const selectProject = useAppStore((state) => state.selectProject);

	// spinner handling
	const promises = usePromiseStatus();

	if (!projectData.project) return null;

	return (
		<li className="w-full">
			<Tooltip
				title="Project actions"
				description="Specific to this project"
				type="modal"
				direction="top"
				element={
					<div className="flex flex-col gap-1">
						<Tooltip description="Delete this event" direction="right">
							<Button className="w-full">
								<Image src="cross.svg" width={16} height={16} alt="" />
								Delete
							</Button>
						</Tooltip>
						<Tooltip
							description="Emulate an event for this project"
							direction="bottom"
							type="modal"
							element={
								<div className="flex flex-col gap-1">
									<Button>Send</Button>
									<Button>Fetch</Button>
									<Button>View</Button>
								</div>
							}
						>
							<Button className="w-full">
								<Image src="emulate.svg" width={16} height={16} alt="" />
								Emulate
							</Button>
						</Tooltip>
					</div>
				}
			>
				<Button
					className={`w-full px-4! py-2!  sm:h-16! project-button ${projectData.project.id === selectedProjectId ? "border-blue-3" : ""}`}
					onClick={() => {
						selectProject(projectData.project?.id ?? null);
					}}
				>
					<div className="flex items-center gap-1.5">
						{promises.get("project") === "pending" && <Spinner />}
						<Image src="link.svg" alt="" width={16} height={16} />
						<span>{projectData.project.name}</span>
					</div>

					<div className="flex sm:flex-col justify-evenly sm:justify-between w-full h-full items-end">
						<span>{relativeTime(projectData.project.created_at)}</span>
						<span>{relativeTime(projectData.project.last_event_at)}</span>
					</div>
				</Button>
			</Tooltip>
		</li>
	);
};
