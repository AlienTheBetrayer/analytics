import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Select } from "@/features/ui/select/components/Select";
import { DashboardNotificationType } from "@/types/zustand/dashboard";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";
import { useState } from "react";
import { Topline } from "../toplines/emulate/Topline";

export const Emulate = () => {
    // zustand
    const pushNotification = useAppStore((state) => state.pushNotification);

    // react states
    const [status, setStatus] = useState<string>("Information");
    const [type, setType] = useState<string>("Account");
    const [title, setTitle] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    return (
        <div className="flex flex-col gap-2 grow">
            <Topline />
            <hr/>
            <form
                className="flex flex-col gap-2 grow"
                onSubmit={(e) => {
                    e.preventDefault();
                    pushNotification({
                        status: status.toLowerCase() as DashboardNotificationType,
                        type: type.toLowerCase() as "dashboard" | "account",
                        description,
                        title,
                    });
                }}
            >
                <label htmlFor="status">Status</label>
                <Select
                    id="status"
                    items={["Information", "Warning", "Error"]}
                    value={status}
                    onChange={(e) => setStatus(e)}
                />
                <hr className="mb-2" />

                <label htmlFor="type">Type</label>
                <Select
                    id="type"
                    items={["Account", "Dashboard"]}
                    value={type}
                    onChange={(e) => setType(e)}
                />
                <hr className="mb-2" />

                <label htmlFor="title">Title</label>
                <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e)}
                    placeholder="at least 4 characters"
                    minLength={4}
                    maxLength={32}
                    required
                />
                <hr className="mb-2" />

                <label htmlFor="description">Description</label>
                <Input
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e)}
                    placeholder="descriptive text for the notification"
                    maxLength={128}
                />

                <hr className="mt-auto" />
                <Tooltip
                    className="w-full"
                    direction="top"
                    text="Push the notification"
                >
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
                </Tooltip>
            </form>
        </div>
    );
};
