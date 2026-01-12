import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { NotificationTab } from "@/types/zustand/local";
import { useLocalStore } from "@/zustand/localStore";
import { FilterTabType } from "./toplines/account/Filter";
import { useFilterSelector } from "../hooks/useFilterSelector";

type Props = {
    tab: FilterTabType;
    notificationTab: NotificationTab;
};

export const FilterSelector = ({ tab, notificationTab }: Props) => {
    // zustand
    const setFilter = useLocalStore((state) => state.setFilter);
    const filter = useLocalStore((state) =>
        notificationTab === "Account"
            ? state.accountFilter
            : state.dashboardFilter
    );

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
                        setFilter({
                            type:
                                notificationTab === "Account"
                                    ? "account-filter"
                                    : "dashboard-filter",
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
