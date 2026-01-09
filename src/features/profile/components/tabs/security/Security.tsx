import Image from "next/image";
import { useEffect } from "react";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { promiseStatus } from "@/utils/other/status";
import { useAppStore } from "@/zustand/store";
import { Profile, User } from "@/types/tables/account";
import { useLocalStore } from "@/zustand/localStore";
import { ProfileImage } from "../../ProfileImage";
import { Form } from "./Form";
import { Role } from "../../parts/Role";

type Props = {
    data: { profile: Profile; user: User };
};

export const Security = ({ data }: Props) => {
    // zustand states
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const logout = useAppStore((state) => state.logout);
    const getSessions = useAppStore((state) => state.getSessions);
    const setVisibleProfile = useLocalStore((state) => state.setVisibleProfile);

    // fetching sessions
    useEffect(() => {
        getSessions({ user_id: data.user.id });
    }, [getSessions, data.user]);

    return (
        <div className="flex flex-col gap-4 p-8 w-full">
            <div className="flex flex-col gap-2 items-center">
                <span className="text-foreground-2! text-5!">
                    <mark>{data.user.username}</mark>
                    &apos;s profile
                </span>
                <span>Security & Authentication</span>
            </div>

            <hr />
            <div className="flex flex-col md:flex-row gap-4 grow w-full">
                <div className="flex flex-col items-center gap-2 w-full md:max-w-96">
                    <span>{data.profile.name}</span>
                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                    />

                    <Role data={data} />

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
                </div>

                <hr className="sm:w-px! sm:h-full" />

                <Form data={data} />
            </div>
        </div>
    );
};
