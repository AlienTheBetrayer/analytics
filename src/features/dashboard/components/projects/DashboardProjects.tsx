import { Spinner } from "@/features/spinner/components/Spinner";
import { useAppStore } from "@/zustand/store";
import { DashboardProject } from "./DashboardProject";

export const DashboardProjects = () => {
    // zustand
    const projects = useAppStore((state) => state.projects);

    if (!Object.values(projects).length) {
        return <Spinner styles="big" />;
    }

    return (
        <div className="flex flex-col gap-4 relative max-h-64">
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
        </div>
    );
};
