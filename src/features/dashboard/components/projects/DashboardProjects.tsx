import { useAppStore } from "@/zustand/store";
import { DashboardProject } from "./DashboardProject";
import { ProjectTopline } from "../topline/projects/ProjectTopline";

export const DashboardProjects = () => {
    // zustand
    const projects = useAppStore((state) => state.projects);

    return (
        <div className="flex flex-col gap-4 relative max-h-256">
            <ProjectTopline />
            <hr/>

            {!Object.values(projects).length ? (
                <div className="flex flex-col gap-4 mt-24 relative">
                    <span className="m-auto">
                        No projects so far. Try re-fetching
                    </span>
                    <span className="m-auto absolute text-[14rem]! left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <small>?</small>
                    </span>
                </div>
            ) : (
                <ul
                    className="flex flex-col gap-2 h-full overflow-y-auto overflow-x-hidden scheme-dark"
                    style={{
                        scrollbarWidth: "thin",
                    }}
                >
                    {Object.values(projects).map((project) => (
                        <DashboardProject
                            key={project.id}
                            id={project.id}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};
