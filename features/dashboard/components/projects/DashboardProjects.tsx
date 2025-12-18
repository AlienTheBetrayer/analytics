import "./DashboardProjects.css";

import type { useData } from "../../hooks/useData";
import { DashboardProject } from "./DashboardProject";

type Props = {
	controller: ReturnType<typeof useData>;
};

export const DashboardProjects = ({ controller }: Props) => {
	return (
		controller.data !== null && (
			<div className="flex flex-col gap-4 relative">
				<h3 className="sm:text-center">Available projects</h3>
				<ul
					className="flex flex-col gap-2 max-h-48 overflow-y-scroll scheme-dark"
					style={{
						maskImage: "linear-gradient(to top, transparent 0%, black 30%)",
						scrollbarWidth: "thin",
					}}
				>
					{controller.data.map((projectData) => (
						<DashboardProject
							key={projectData.project.id}
							controller={controller}
							projectData={projectData}
						/>
					))}
				</ul>
			</div>
		)
	);
};
