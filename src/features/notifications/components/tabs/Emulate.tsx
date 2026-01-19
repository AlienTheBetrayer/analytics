import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Select } from "@/features/ui/select/components/Select";
import Image from "next/image";
import { useState } from "react";
import { Topline } from "../toplines/emulate/Topline";
import { useAppStore } from "@/zustand/store";
import {
    NotificationStatus,
    NotificationTab,
} from "@/types/other/notifications";

export const Emulate = () => {
    // zustand
    const pushNotification = useAppStore((state) => state.pushNotification);

    // react states
    const [status, setStatus] = useState<NotificationStatus>("Information");
    const [tab, setTab] = useState<NotificationTab>("Account");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    return (
        <div className="flex flex-col gap-2 grow">
            <Topline />
            <hr />
            <form
                className="flex flex-col grow"
                onSubmit={(e) => {
                    e.preventDefault();
                    pushNotification({
                        status,
                        tab,
                        description,
                        title,
                    });
                }}
            >
                <ul className="flex flex-col gap-2 grow">
                    <li className="flex flex-col gap-1">
                        <label
                            className="flex items-center gap-1"
                            htmlFor="title"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/notification.svg"
                            />
                            Title
                        </label>
                        <Input
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e)}
                            placeholder="at least 4 characters"
                            minLength={4}
                            maxLength={32}
                            required
                        />
                    </li>

                    <li className="mb-2!">
                        <hr />
                    </li>

                    <li className="flex flex-col gap-1">
                        <label
                            className="flex items-center gap-1"
                            htmlFor="description"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/menu.svg"
                            />
                            Description
                        </label>
                        <Input
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e)}
                            placeholder="descriptive text for the notification"
                            maxLength={128}
                        />
                    </li>

                    <li>
                        <hr className="mb-2" />
                    </li>

                    <li>
                        <ul className="grid md:grid-cols-[1fr_auto_1fr] gap-4">
                            <li className="flex flex-col gap-1">
                                <label
                                    className="flex items-center gap-1"
                                    htmlFor="status"
                                >
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/social.svg"
                                    />
                                    Status
                                </label>
                                <Select
                                    id="status"
                                    items={["Information", "Warning", "Error"]}
                                    value={status}
                                    onChange={(e) =>
                                        setStatus(e as NotificationStatus)
                                    }
                                />
                            </li>

                            <li className="flex">
                                <hr className="self-center md:w-px! md:h-1/2!" />
                            </li>

                            <li className="flex flex-col gap-1">
                                <label
                                    className="flex items-center gap-1"
                                    htmlFor="tab"
                                >
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/type.svg"
                                    />
                                    Tab
                                </label>
                                <Select
                                    id="tab"
                                    items={["Account", "Dashboard"]}
                                    value={tab}
                                    onChange={(e) =>
                                        setTab(e as NotificationTab)
                                    }
                                />
                            </li>
                        </ul>
                    </li>

                    <li className="mt-auto!">
                        <hr />
                    </li>

                    <li className="flex flex-col gap-1">
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/send.svg"
                            />
                            Push
                        </Button>
                    </li>
                </ul>
            </form>
        </div>
    );
};
