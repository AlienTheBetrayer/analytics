import Image from "next/image";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { usePromiseStatus } from "@/hooks/usePromiseStatus";
import type { ProjectData } from "@/types/zustand/data";
import { relativeTime } from "@/utils/relativeTime";
import { useAppStore } from "@/zustand/store";
import linkImg from "../../../../public/link.svg";

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
		<Tooltip
			description={`View events`}
			direction="top"
			title={projectData.project?.name}
		>
			<li className="w-full">
				<Button
					className={`w-full project-button ${projectData.project.id === selectedProjectId ? "border-blue-3" : ""}`}
					onClick={() => {
						selectProject(projectData.project?.id ?? null);
					}}
				>
					<div className="flex items-center gap-1.5">
						{promises.get("project") === "pending" && <Spinner />}
						<Image src={linkImg} alt="" className={`image`} />
						<span>{projectData.project.name}</span>
					</div>

					<span className={`transition-all duration-300 text-left events-span`}>
						<small className="text-3xl!">{projectData.events?.length}</small>
						<small> events</small>
					</span>

					<span style={{}} className={`transition-all duration-300 text-left`}>
						<small className="text-3xl!">
							{projectData?.aggregates?.visits ?? 0}
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
