import { NoMessages } from "@/features/contact/components/errors/NoMessages";
import { Item } from "@/features/contact/components/tabs/list/Item";
import { ContactListItems } from "@/features/contact/components/tabs/list/List";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";
import { queryCache } from "@/query/init";
import { AuthenticationToken } from "@/types/auth/authentication";
import { ContactMessage } from "@/types/tables/contact";
import Image from "next/image";
import React from "react";

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
            <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }, (_, k) => (
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
const ListItemsSelect = ({
    reversed,
    filter,
    tab,
    status,
    collapsed,
}: SelectProps) => {
    // dynamic fetching
    const { data, isLoading } = useQuery({
        key:
            tab === "own"
                ? ["contact_messages", status.id]
                : ["contact_messages"],
    });

    // ui states
    const deleteBox = useMessageBox();

    // fallbacks
    if (isLoading) {
        return (
            <div className="flex flex-col gap-2">
                {Array.from({ length: 4 }, (_, k) => (
                    <div
                        className="w-full min-h-32 loading rounded-4xl!"
                        key={k}
                    />
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
        <ul
            className="flex flex-col gap-8 overflow-hidden transition-all duration-500"
            style={{
                height: collapsed ? "0" : "auto",
                interpolateSize: "allow-keywords",
            }}
        >
            {deleteBox.render({
                children:
                    "This message will be permanently deleted and we won't be able to see it.",
                onSelect: (res) => {
                    if (res === "yes") {
                        alert("delte");
                    }
                },
            })}

            {(reversed ? [...data].reverse() : data).map((id) => (
                <React.Fragment key={id}>
                    <li>
                        <div className="flex flex-col">
                            <ul className="box h-10! px-3! flex-row! gap-1! items-center! justify-start! p-0! rounded-b-none!">
                                <li>
                                    <LinkButton href={`/contact/view/${id}`}>
                                        <Image
                                            alt="view"
                                            width={16}
                                            height={16}
                                            src="/launch.svg"
                                        />
                                    </LinkButton>
                                </li>

                                <li className="ml-auto!">
                                    <ul className="flex items-center gap-1">
                                        {status.id ===
                                            (
                                                queryCache.get({
                                                    key: [
                                                        "contact_message",
                                                        id,
                                                    ],
                                                }) as ContactMessage
                                            ).user_id && (
                                            <li>
                                                <Tooltip text="Edit message">
                                                    <LinkButton
                                                        href={`/contact/edit/${id}`}
                                                    >
                                                        <Image
                                                            alt="edit"
                                                            width={16}
                                                            height={16}
                                                            src="/pencil.svg"
                                                        />
                                                    </LinkButton>
                                                </Tooltip>
                                            </li>
                                        )}

                                        <li>
                                            <Tooltip text="Unsend">
                                                <Button
                                                    onClick={deleteBox.show}
                                                >
                                                    <Image
                                                        alt="delete"
                                                        width={16}
                                                        height={16}
                                                        src="/delete.svg"
                                                    />
                                                </Button>
                                            </Tooltip>
                                        </li>
                                    </ul>
                                </li>
                            </ul>

                            <Item
                                className="rounded-t-none!"
                                filter={filter}
                                id={id}
                            />
                        </div>
                    </li>

                    <li>
                        <hr className="w-full max-w-9/11 mx-auto" />
                    </li>
                </React.Fragment>
            ))}
        </ul>
    );
};
