import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { FilterTabType } from "./Filter";
import { useFilterSelector } from "../../hooks/useFilterSelector";
import { NotificationTab } from "@/types/other/notifications";
import { useAppStore } from "@/zustand/store";

type Props = {
    tab: FilterTabType;
    notificationTab: NotificationTab;
};

export const FilterSelector = ({ tab, notificationTab }: Props) => {
    // zustand
    const setNotificationFilter = useAppStore(
        (state) => state.setNotificationFilter
    );
    const filter = useAppStore((state) => state.filter)[notificationTab];

    const { notificationCount, items } = useFilterSelector(
        tab,
        notificationTab
    );

    return (
        <div
            className="flex flex-col gap-1 max-h-36 overflow-y-auto scheme-dark p-1"
            style={{
                scrollbarWidth: "thin",
            }}
        >
            {items.map((type) => (
                <Checkbox
                    key={type}
                    onToggle={(flag) => {
                        setNotificationFilter({
                            type: "filter",
                            tab: notificationTab,
                            column: [type],
                            flag,
                        });
                    }}
                    value={filter.filtering?.[type]}
                >
                    <span>{type}</span>
                    <span className="ml-auto">
                        <small>{notificationCount[type] ?? 0}</small>
                    </span>
                </Checkbox>
            ))}
        </div>
    );
};
