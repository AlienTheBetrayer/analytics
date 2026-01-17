import Image from "next/image";
import { useEffect, useState } from "react";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import { Profile, User } from "@/types/tables/account";
import { useLocalStore } from "@/zustand/localStore";
import { ProfileImage } from "../../ProfileImage";
import { Spinner } from "@/features/spinner/components/Spinner";
import { MessageBox } from "@/features/messagebox/components/MessageBox";
import { usePopup } from "@/features/popup/hooks/usePopup";
import { redirect } from "next/navigation";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { Select } from "./Select";

type Props = {
    data: { profile: Profile; user: User };
};

export const Security = ({ data }: Props) => {
    // zustand states
    const promises = useAppStore((state) => state.promises);
    const status = useAppStore((state) => state.status);

    // zustand functions
    const logout = useAppStore((state) => state.logout);
    const deleteUser = useAppStore((state) => state.deleteUser);
    const getSessions = useAppStore((state) => state.getSessions);
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);

    // fetching sessions
    useEffect(() => {
        getSessions({ type: "all", user_id: data.user.id });
    }, [getSessions, data.user]);

    // messageboxes
    const deleteMessageBox = usePopup(({ hide }) => (
        <MessageBox
            description="You are about to delete your account data forever!"
            onInteract={(res) => {
                hide();
                if (res === "yes") {
                    deleteUser(data.user.id);
                    if (data.user.id === status?.id) {
                        logout();
                        setVisibleProfile(undefined);
                        redirect("/home");
                    }
                }
            }}
        />
    ));

    // react states
    const [isDeletionEnabled, setIsDeletionEnabled] = useState<boolean>(false);

    return (
        <div className="flex flex-col gap-4 w-full grow">
            {deleteMessageBox.render()}

            <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/security.svg"
                        style={{ filter: `invert(var(--invert-8))` }}
                    />
                    <span className="text-foreground-2! text-5! flex">
                        <mark>{data.user.username}</mark>
                        &apos;s profile
                    </span>
                </div>
                <span>Security & Authentication</span>
            </div>

            <hr />
            <div className="grid lg:grid-cols-[30%_auto_1fr] gap-12 lg:gap-4 grow">
                <div className="flex flex-col items-center gap-2">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />

                    <Tooltip text="Log yourself out">
                        <Button
                            onClick={() => {
                                logout();
                                setVisibleProfile(undefined);
                            }}
                        >
                            {promiseStatus(promises.logout)}
                            <Image
                                width={16}
                                height={16}
                                alt=""
                                src="/auth.svg"
                            />
                            Log out
                        </Button>
                    </Tooltip>

                    <hr className="mt-auto" />
                    <div className="grid grid-cols-[auto_auto_1fr] items-center gap-2 w-full">
                        <Tooltip
                            direction="top"
                            text="Confirm deletion"
                        >
                            <Checkbox
                                className="rounded-full! w-8! justify-center!"
                                onToggle={(e) => setIsDeletionEnabled(e)}
                                value={isDeletionEnabled}
                            />
                        </Tooltip>
                        <hr className="w-px! h-1/3" />

                        <Tooltip
                            text="Wipe your account data"
                            direction="top"
                            className="w-full"
                            disabledPointer
                            isEnabled={isDeletionEnabled}
                        >
                            <Button
                                isEnabled={isDeletionEnabled}
                                className="w-full"
                                onClick={() => {
                                    deleteMessageBox.show();
                                }}
                            >
                                {promises.delete === "pending" && <Spinner />}
                                <Image
                                    src="/delete.svg"
                                    width={16}
                                    height={16}
                                    alt=""
                                />
                                Delete account
                            </Button>
                        </Tooltip>
                    </div>
                </div>

                <hr className="sm:w-px! sm:h-full" />

                <Select data={data} />
            </div>
        </div>
    );
};
