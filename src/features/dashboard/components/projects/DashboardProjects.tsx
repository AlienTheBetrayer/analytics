import { DashboardProject } from "./DashboardProject";
import { useProjectList } from "../../hooks/useProjectList";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["projects"]["data"];
};

export const DashboardProjects = ({ data }: Props) => {
    // filtering
    const { filteredProjects } = useProjectList(data);

    return (
        <ul
            className="flex flex-col gap-2 h-full overflow-y-auto overflow-x-hidden scheme-dark p-1!"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {filteredProjects?.map((project) => (
                <DashboardProject
                    key={project.id}
                    data={project}
                />
            ))}
        </ul>
    );
};
