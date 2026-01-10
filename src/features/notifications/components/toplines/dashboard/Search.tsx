import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Input } from "@/features/ui/input/components/Input";
import { useLocalStore } from "@/zustand/localStore";

export const Search = () => {
    // zustand-state
    const dashboardFilter = useLocalStore((state) => state.dashboardFilter);
    const setFilter = useLocalStore((state) => state.setFilter);

    return (
        <Tooltip
            direction="top"
            text="Filters every field"
        >
            <Input
                className="rounded-full!"
                placeholder="Filter..."
                value={dashboardFilter.search}
                onChange={(value) => {
                    setFilter({ type: "dashboard-search", search: value });
                }}
            />
        </Tooltip>
    );
};
