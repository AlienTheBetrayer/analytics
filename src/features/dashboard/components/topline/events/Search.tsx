import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Input } from "@/features/ui/input/components/Input";
import { useDebounced } from "@/hooks/useDebounced";
import { useAppStore } from "@/zustand/store";
import { useEffect, useState } from "react";

export const Search = () => {
    // zustand
    const eventFilters = useAppStore((state) => state.eventFilters);
    const selectedProjectId = useAppStore((state) => state.selectedProjectId);
    const setFilter = useAppStore((state) => state.setDashboardFilter);

    // input debouncing
    const [searchValue, setSearchValue] = useState<string>(
        selectedProjectId
            ? (eventFilters[selectedProjectId]?.eventsSearch ?? "")
            : "",
    );

    const debounced = useDebounced(searchValue, 75);

    useEffect(() => {
        if (!selectedProjectId) {
            return;
        }

        setFilter({
            type: "event-search",
            project_id: selectedProjectId,
            search: debounced,
        });
    }, [debounced, selectedProjectId, setFilter]);

    return (
        <Tooltip text="Filters every field">
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
