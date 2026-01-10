import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Input } from "@/features/ui/input/components/Input";
import { useLocalStore } from "@/zustand/localStore";

export const Search = () => {
    // zustand-state
    const accountFilter = useLocalStore((state) => state.accountFilter);
    const setFilter = useLocalStore((state) => state.setFilter);

    return (
        <Tooltip
            direction="top"
            text="Filters every field"
        >
            <Input
                className="rounded-full!"
                placeholder="Filter..."
                value={accountFilter.search}
                onChange={(value) => {
                    setFilter({ type: "account-search", search: value });
                }}
            />
        </Tooltip>
    );
};
