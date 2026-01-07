import { Project } from "@/types/tables/project";
import { useAppStore } from "@/zustand/store";
import { useMemo } from "react";

export const useProjectList = () => {
    // zustand state
    const projects = useAppStore((state) => state.projects);
    const projectFilters = useAppStore((state) => state.projectFilters);

    // all projects
    const allProjects = Object.values(projects);

    // filter projects
    const search = projectFilters.projectSearch;
    const sorting = projectFilters.projectSorting;

    // filtering & memoization
    const filteredProjects = useMemo(() => {
        if (!allProjects) {
            return;
        }

        let filtered: Project[] = allProjects;

        // search filtering
        if (search) {
            filtered = filtered.filter((e) => e.name?.includes(search));
        }

        // sorting
        const column = sorting?.column ?? "Created Date";
        const direction = !sorting
            ? -1
            : (sorting.direction ?? "descendant") === "descendant"
              ? -1
              : 1;

        switch (column) {
            case "Name": {
                filtered.sort(
                    (a, b) => direction * a.name.localeCompare(b.name)
                );
                break;
            }
            case "Created Date": {
                filtered.sort((a, b) =>
                    !a.created_at || !b.created_at
                        ? 0
                        : direction *
                          (new Date(a.created_at).getTime() -
                              new Date(b.created_at).getTime())
                );
                break;
            }
            case "Updated Date": {
                filtered.sort((a, b) =>
                    !a.last_event_at || !b.last_event_at
                        ? 0
                        : direction *
                          (new Date(a.last_event_at).getTime() -
                              new Date(b.last_event_at).getTime())
                );
                break;
            }
        }

        return filtered;
    }, [search, sorting, allProjects]);

    return {
        filteredProjects,
    };
};
