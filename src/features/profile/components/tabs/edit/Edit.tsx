import "./Edit.css";
import { type JSX, useState } from "react";

import { Avatar } from "./Avatar";
import { Form } from "./Form";
import Image from "next/image";
import { CacheAPIProtocol } from "@/query-api/protocol";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Edit = ({ data }: Props) => {
    // file uploading
    const [fileError, setFileError] = useState<JSX.Element | undefined>();
    const [avatarFile, setAvatarFile] = useState<File | undefined>(undefined);
    const [avatar, setAvatar] = useState<string | null | undefined>(
        data.profile.avatar_url ?? undefined,
    );

    return (
        <div className="flex flex-col gap-4 w-full grow">
            <div className="flex flex-col gap-2 items-center">
                <div className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/pencil.svg"
                    />
                    <span className="text-foreground-2! flex">
                        <mark>{data.username}</mark>
                        &apos;s profile
                    </span>
                </div>
                <span>Appearance editing</span>
            </div>

            <hr />

            <div className="grid lg:grid-cols-[30%_1fr] gap-16 lg:gap-8 grow">
                <Avatar
                    data={data}
                    avatar={[avatar, setAvatar]}
                    avatarFile={[avatarFile, setAvatarFile]}
                    fileError={[fileError, setFileError]}
                />

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
