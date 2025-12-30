import { Spinner } from "@/features/spinner/components/Spinner";
import { useAppStore } from "@/zustand/store";
import { DashboardProject } from "./DashboardProject";

export const DashboardProjects = () => {
    // zustand
    const data = useAppStore((state) => state.data);

    if (data === undefined || Object.values(data).length === 0) {
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
                {Object.entries(data).map(([id, projectData]) => (
                    <DashboardProject key={id} projectData={projectData} />
                ))}
            </ul>
        </div>
    );
};
