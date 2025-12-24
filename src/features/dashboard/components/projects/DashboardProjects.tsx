import "./DashboardProjects.css";

import { DashboardProject } from "./DashboardProject";
import { Spinner } from "@/features/spinner/components/Spinner";
import { useAppStore } from "@/zustand/store";

export const DashboardProjects = () => {
	// zustand
	const data = useAppStore((state) => state.data);

	if (data === null) {
		return <Spinner styles="big" />;
	}

	return (
		<div className="flex flex-col gap-4 relative">
			<span className="sm:text-center text-5!">Available projects</span>
			<ul
				className="flex flex-col gap-2 max-h-48 overflow-y-scroll scheme-dark pb-4!"
				style={{
					maskImage: "linear-gradient(to top, transparent 0%, black 30%)",
					scrollbarWidth: "thin",
				}}
			>
				{Object.entries(data).map(([id, projectData]) => (
					<DashboardProject key={id} projectData={projectData} />
				))}
			</ul>
		</div>
	);
};
