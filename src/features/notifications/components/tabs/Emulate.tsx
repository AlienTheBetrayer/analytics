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

    // react input states
    const [status, setStatus] = useState<NotificationStatus>("Information");
    const [tab, setTab] = useState<NotificationTab>("Account");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    return (
        <div className="flex flex-col gap-4 grow">
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
                        type: "Emulated",
                    });
                }}
            >
                <ul className="flex flex-col gap-8 grow">
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
                        <ul className="grid md:grid-cols-2 gap-8">
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

                    <li className="flex flex-col gap-1 mt-auto!">
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
