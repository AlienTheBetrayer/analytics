import "./Edit.css";
import { type JSX, useState } from "react";

import { Profile, User } from "@/types/tables/account";
import { Avatar } from "./Avatar";
import { Form } from "./Form";
import Image from "next/image";

type Props = {
    data: { profile: Profile; user: User };
};

export const Edit = ({ data }: Props) => {
    // file uploading
    const [fileError, setFileError] = useState<JSX.Element | undefined>();
    const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
    const [avatar, setAvatar] = useState<string | null | undefined>(
        data.profile.avatar_url ?? undefined
    );

    return (
        <div className="flex flex-col gap-4 p-8 w-full grow">
            <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/pencil.svg"
                        style={{ filter: `invert(var(--invert-8))` }}
                    />
                    <span className="text-foreground-2! text-5! flex">
                        <mark>{data.user.username}</mark>
                        &apos;s profile
                    </span>
                </div>
                <span>Appearance editing</span>
            </div>

            <hr />

            <div className="grid lg:grid-cols-[30%_auto_1fr] gap-4 grow">
                <Avatar
                    data={data}
                    avatar={[avatar, setAvatar]}
                    avatarFile={[avatarFile, setAvatarFile]}
                    fileError={[fileError, setFileError]}
                />

                <hr className="sm:w-px! sm:h-full" />

                <Form
                    data={data}
                    avatar={[avatar, setAvatar]}
                    avatarFile={[avatarFile, setAvatarFile]}
                    fileError={[fileError, setFileError]}
                />
            </div>
        </div>
    );
};
