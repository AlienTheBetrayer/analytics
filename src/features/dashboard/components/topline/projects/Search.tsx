import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Input } from "@/features/ui/input/components/Input";
import { useDebounced } from "@/hooks/useDebounced";
import { useAppStore } from "@/zustand/store";
import { useEffect, useState } from "react";

export const Search = () => {
    // zustand
    const projectFilters = useAppStore((state) => state.projectFilters);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const setFilter = useAppStore((state) => state.setDashboardFilter);

    // input debouncing
    const [searchValue, setSearchValue] = useState<string>(
        selectedProjectId ? (projectFilters?.projectSearch ?? "") : ""
    );

    const debounced = useDebounced(searchValue, 75);

    useEffect(() => {
        if (!selectedProjectId) {
            return;
        }

        setFilter({
            type: "project-search",
            project_id: selectedProjectId,
            search: debounced,
        });
    }, [debounced, selectedProjectId, setFilter]);

    return (
        <Tooltip
            direction="top"
            text="Filters every field"
        >
            <Input
                className="rounded-full!"
                placeholder="Filter..."
                value={searchValue}
                onChange={(value) => {
                    setSearchValue(value);
                }}
            />
        </Tooltip>
    );
};
