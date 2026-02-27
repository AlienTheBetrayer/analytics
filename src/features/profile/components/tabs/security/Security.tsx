import Image from "next/image";
import { useState } from "react";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { ProfileImage } from "../../ProfileImage";
import { redirect } from "next/navigation";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { Select } from "./Select";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { PromiseState } from "@/promises/components/PromiseState";
import { useQuery } from "@/query/core";
import { applicationLogout, deleteUser } from "@/query-api/calls/auth";
import { wrapPromise } from "@/promises/core";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Security = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    // react states
    const [isDeletionEnabled, setIsDeletionEnabled] = useState<boolean>(false);

    // message boxes
    const deleteBox = useMessageBox();

    return (
        <div className="flex flex-col gap-4 w-full grow">
            {deleteBox.render({
                children:
                    "You are about to delete your account data forever! Think twice!",
                onSelect: (res) => {
                    if (res === "yes") {
                        if (data.id === status?.id) {
                            deleteUser({ user_id: data.id });
                            redirect("/home");
                        }
                    }
                },
            })}

            <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/security.svg"
                    />
                    <span className="text-foreground-2! flex">
                        <mark>{data.username}</mark>
                        &apos;s profile
                    </span>
                </div>
                <span>Security & Authentication</span>
            </div>

            <hr />

            <div className="grid lg:grid-cols-[30%_1fr] gap-16 lg:gap-8 grow">
                <div className="flex flex-col items-center gap-2">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />

                    <div className="grid grid-cols-2 items-center gap-2 w-full max-w-96 lg:max-w-full mt-auto!">
                        <Tooltip
                            text="Log yourself out"
                            className="w-full"
                        >
                            <Button
                                className="w-full"
                                onClick={() => {
                                    wrapPromise("logout", async () => {
                                        applicationLogout();
                                    });
                                }}
                            >
                                <PromiseState state="logout" />
                                <Image
                                    width={16}
                                    height={16}
                                    alt=""
                                    src="/auth.svg"
                                />
                                Log out
                            </Button>
                        </Tooltip>

                        <div className="flex items-center gap-1">
                            <Tooltip
                                direction="top"
                                text="Confirm deletion"
                            >
                                <Checkbox
                                    className="rounded-full! w-8! justify-center! bg-blue-1"
                                    onToggle={(e) => setIsDeletionEnabled(e)}
                                    value={isDeletionEnabled}
                                />
                            </Tooltip>

                            <Tooltip
                                text="Wipe your account data"
                                direction="top"
                                className="w-full whitespace-nowrap"
                                isEnabled={isDeletionEnabled}
                            >
                                <Button
                                    className="w-full"
                                    onClick={() => {
                                        deleteBox.show();
                                    }}
                                    isEnabled={isDeletionEnabled}
                                >
                                    <PromiseState state="delete" />
                                    <Image
                                        src="/delete.svg"
                                        width={16}
                                        height={16}
                                        alt=""
                                    />
                                    <Image
                                        src="/account.svg"
                                        width={16}
                                        height={16}
                                        alt=""
                                    />
                                    Delete
                                </Button>
                            </Tooltip>
                        </div>
                    </div>
                </div>

                <Select data={data} />
            </div>
        </div>
    );
};
