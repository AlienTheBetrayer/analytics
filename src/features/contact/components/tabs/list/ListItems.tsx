import { NoMessages } from "@/features/contact/components/errors/NoMessages";
import { Item } from "@/features/contact/components/tabs/list/Item";
import { ContactListItems } from "@/features/contact/components/tabs/list/List";
import { useQuery } from "@/query/core";
import { AuthenticationToken } from "@/types/auth/authentication";

type Props = {
    tab: (typeof ContactListItems)[number];
};

export const ListItems = ({ tab }: Props) => {
    const { data: status, isLoading } = useQuery({ key: ["status"] });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 1 }, (_, k) => (
                    <div
                        className="w-full min-h-32 loading rounded-4xl!"
                        key={k}
                    />
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
        />
    );
};

type SelectProps = {
    tab: Props["tab"];
    status: AuthenticationToken;
};
const ListItemsSelect = ({ tab, status }: SelectProps) => {
    const { data, isLoading } = useQuery({
        key:
            tab === "own"
                ? ["contact_messages", status.id]
                : ["contact_messages"],
    });

    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 10 }, (_, k) => (
                    <div
                        className="w-full min-h-32 loading rounded-4xl!"
                        key={k}
                    />
                ))}
            </div>
        );
    }

    if (!data?.length) {
        return <NoMessages />;
    }

    return (
        <ul className="flex flex-col gap-4">
            {data.map((id) => (
                <Item
                    key={id}
                    id={id}
                />
            ))}
        </ul>
    );
};
