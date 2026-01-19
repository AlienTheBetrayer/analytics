import { Tooltip } from "@/features/popovers/components/tooltip/Tooltip";
import { Input } from "@/features/ui/input/components/Input";
import { NotificationTab } from "@/types/other/notifications";
import { useAppStore } from "@/zustand/store";

type Props = {
    tab: NotificationTab;
};

export const Search = ({ tab }: Props) => {
    // zustand-state
    const filter = useAppStore((state) => state.filter)[tab];
    const setNotificationFilter = useAppStore(
        (state) => state.setNotificationFilter,
    );

    return (
        <Tooltip text="Filters every field">
            <Input
                className="rounded-full!"
                placeholder="Filter..."
                value={filter.search}
                onChange={(value) => {
                    setNotificationFilter({
                        type: "search",
                        tab,
                        search: value,
                    });
                }}
            />
        </Tooltip>
    );
};
