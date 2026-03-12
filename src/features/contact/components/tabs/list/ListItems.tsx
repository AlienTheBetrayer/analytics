import { NoMessages } from "@/features/contact/components/errors/NoMessages";
import { Item } from "@/features/contact/components/tabs/list/Item";
import { ContactListItems } from "@/features/contact/components/tabs/list/List";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { useQuery } from "@/query/core";
import { AuthenticationToken } from "@/types/auth/authentication";

type Props = {
    tab: (typeof ContactListItems)[number];
    collapsed?: boolean;
    filter?: string;
    reversed?: boolean;
};

export const ListItems = ({ filter, reversed, tab, collapsed }: Props) => {
    const { data: status, isLoading } = useQuery({ key: ["status"] });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }, (_, k) => (
                    <div
                        className="flex items-center justify-center relative w-full min-h-32 loading rounded-4xl!"
                        key={k}
                    >
                        <Spinner className="absolute left-1/2 top-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (!status) {
        return (
            <div className="flex items-center justify-center grow">
                <NoMessages />
            </div>
        );
    }

    return (
        <ListItemsSelect
            status={status}
            tab={tab}
            collapsed={collapsed ?? false}
            filter={filter}
            reversed={reversed}
        />
    );
};

type SelectProps = {
    tab: Props["tab"];
    status: AuthenticationToken;
    collapsed: boolean;
    filter?: string;
    reversed?: boolean;
};
const ListItemsSelect = ({ reversed, filter, tab, status, collapsed }: SelectProps) => {
    // dynamic fetching
    const { data, isLoading } = useQuery({
        key: tab === "own" ? ["contact_messages", status.id] : ["contact_messages"],
    });

    // fallbacks
    if (isLoading) {
        return (
            <div className="flex flex-col gap-4">
                {Array.from({ length: 4 }, (_, k) => (
                    <div
                        className="flex items-center justify-center relative w-full min-h-32 loading rounded-4xl!"
                        key={k}
                    >
                        <Spinner className="absolute left-1/2 top-1/2 -translate-1/2" />
                    </div>
                ))}
            </div>
        );
    }

    if (!data?.length) {
        return (
            <div className="flex items-center justify-center grow">
                <NoMessages />
            </div>
        );
    }

    return (
        <div
            className={`box grow bg-bg-2! p-4! border-0! grid! gap-4 overflow-hidden transition-all duration-500 
                ${collapsed ? "grid-rows-[0fr]" : "grid-rows-[1fr]"}`}
        >
            <ul className="flex flex-col gap-2 overflow-hidden">
                {(reversed ? [...data].reverse() : data).map((id) => (
                    <li key={id}>
                        <Item
                            className="rounded-t-none!"
                            filter={filter}
                            id={id}
                        />
                    </li>
                ))}
            </ul>
        </div>
    );
};
