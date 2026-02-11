import { DisplayFormat } from "@/features/contact/components/tabs/list/DisplayFormat";
import { ListItems } from "@/features/contact/components/tabs/list/ListItems";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { queryInvalidate } from "@/query/auxiliary";
import { useQuery } from "@/query/core";
import { TabSelection } from "@/utils/other/TabSelection";
import Image from "next/image";
import { useState } from "react";

export const ContactListItems = ["own", "received"] as const;

export const List = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    const { data: message_ids } = useQuery({
        key: ["contact_messages", status?.id],
    });

    // react states
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [filter, setFilter] = useState<string>("");
    const [reversed, setReversed] = useState<boolean>(false);
    const [tab, setTab] = useState<(typeof ContactListItems)[number]>("own");

    return (
        <div className="flex flex-col gap-4 w-full h-full grow">
            <ul
                className={`box bg-bg-2! sticky! top-4 p-0! h-10! flex-row! w-full items-center mt-6! md:mt-0!`}
            >
                <li>
                    <Tooltip text="Own messages">
                        <Button onClick={() => setTab("own")}>
                            <Image
                                alt="+"
                                width={16}
                                height={16}
                                src="/book.svg"
                            />
                            Personal
                            <TabSelection condition={tab === "own"} />
                        </Button>
                    </Tooltip>
                </li>

                {status && status.role !== "user" && (
                    <li>
                        <Tooltip text="Admin panel">
                            <Button onClick={() => setTab("received")}>
                                <Image
                                    alt="+"
                                    width={16}
                                    height={16}
                                    src="/arrow.svg"
                                />
                                <TabSelection condition={tab === "received"} />
                                Received
                            </Button>
                        </Tooltip>
                    </li>
                )}

                <li className="absolute left-1/2 -top-1/2 md:top-1/2 -translate-1/2">
                    <span className="flex items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/cubes.svg"
                        />
                        Messages:
                    </span>
                </li>

                <li className="ml-auto!">
                    <Tooltip text="Refresh data">
                        <Button
                            aria-label="reload"
                            onClick={() => {
                                if (!status) {
                                    return;
                                }

                                wrapPromise("reloadContact", async () => {
                                    return queryInvalidate({
                                        key:
                                            tab === "received"
                                                ? ["contact_messages"]
                                                : [
                                                      "contact_messages",
                                                      status.id,
                                                  ],
                                        silent: false,
                                    });
                                });
                            }}
                        >
                            <PromiseState state="reloadContact" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/reload.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </ul>

            <ul
                className={`box bg-bg-2! sticky! top-16 p-0! h-10! flex-row! w-full items-center
            ${!message_ids?.length ? "opacity-30" : ""}`}
                inert={!!!message_ids?.length}
            >
                {!message_ids?.length && (
                    <li className="absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap">
                        <span>
                            Send a <mark>message</mark> to access
                        </span>
                    </li>
                )}

                <li>
                    <Tooltip text="Expanded / Collapsed">
                        <Button
                            className="p-0!"
                            onClick={() => {
                                setCollapsed((prev) => !prev);
                            }}
                        >
                            <Image
                                alt="+"
                                width={20}
                                height={20}
                                src="/collapse.svg"
                            />
                            <TabSelection
                                condition={true}
                                color={
                                    !collapsed
                                        ? "var(--blue-1)"
                                        : "var(--orange-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li>
                    <Tooltip text="Sort direction">
                        <Button
                            className="p-0!"
                            onClick={() => {
                                setReversed((prev) => !prev);
                            }}
                        >
                            <Image
                                alt="+"
                                width={16}
                                height={16}
                                src="/sort.svg"
                                className="transition-all duration-500!"
                                style={{
                                    rotate: reversed ? `180deg` : `0deg`,
                                }}
                            />
                            <TabSelection
                                condition={true}
                                color={
                                    !reversed
                                        ? "var(--blue-1)"
                                        : "var(--orange-1)"
                                }
                            />
                        </Button>
                    </Tooltip>
                </li>

                <li className="flex items-center self-stretch!">
                    <hr className="w-px! h-1/2!" />
                </li>

                <li>
                    <Input
                        placeholder="Filter by title"
                        value={filter}
                        onChange={(value) => setFilter(value)}
                    />
                </li>

                <li className="ml-auto!">
                    <Tooltip text="Display format">
                        <Modal
                            direction="bottom-left"
                            element={() => <DisplayFormat />}
                        >
                            <Button>
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/cubes.svg"
                                />
                            </Button>
                        </Modal>
                    </Tooltip>
                </li>
            </ul>

            <hr />

            <ListItems
                tab={tab}
                collapsed={collapsed}
                filter={filter}
                reversed={reversed}
            />
        </div>
    );
};
