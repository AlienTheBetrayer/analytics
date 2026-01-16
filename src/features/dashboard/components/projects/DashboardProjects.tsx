import { DashboardProject } from "./DashboardProject";
import { ProjectTopline } from "../topline/projects/ProjectTopline";
import { useProjectList } from "../../hooks/useProjectList";

export const DashboardProjects = () => {
    // zustand
    const { filteredProjects } = useProjectList();

    return (
        <div className="flex flex-col gap-3 relative max-h-256">
            <ProjectTopline />
            <hr />

            <ul
                className="flex flex-col gap-2 h-full overflow-y-auto overflow-x-hidden scheme-dark p-1!"
                style={{
                    scrollbarWidth: "thin",
                }}
            >
                {filteredProjects?.map((project) => (
                    <DashboardProject
                        key={project.id}
                        id={project.id}
                    />
                ))}
            </ul>
        </div>
    );
};
