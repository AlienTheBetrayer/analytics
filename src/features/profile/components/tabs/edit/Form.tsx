import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { promiseStatus } from "@/utils/other/status";
import { EditAvatarProps } from "./Avatar";
import { useAppStore } from "@/zustand/store";
import { useState } from "react";
import Image from "next/image";

export const Form = ({ avatar, avatarFile, data }: EditAvatarProps) => {
    // zustand
    // zustand state
    const promises = useAppStore((state) => state.promises);

    // zustand functions
    const updateUser = useAppStore((state) => state.updateUser);

    // input states
    const [status, setStatus] = useState<string>(data.profile.status ?? "");
    const [name, setName] = useState<string>(data.profile.name ?? "");
    const [bio, setBio] = useState<string>(data.profile.bio ?? "");
    const [title, setTitle] = useState<string>(data.profile.title ?? "");

    return (
        <form
            className="flex flex-col gap-2 w-full"
            onSubmit={async (e) => {
                e.preventDefault();

                let dataAvatar = avatar[0];
                if (avatarFile?.[0]) {
                    dataAvatar = await fileToBase64(avatarFile?.[0]);
                }

                updateUser({
                    id: data.user.id,
                    data: {
                        status,
                        bio,
                        title,
                        name,
                        avatar_url: dataAvatar,
                        avatar_name: avatarFile?.[0]?.name,
                        avatar_type: avatarFile?.[0]?.type,
                    },
                });
            }}
        >
            <label
                htmlFor="name"
                className="flex items-center"
            >
                <b>Name</b>
                <small className="ml-auto text-ellipsis-left">
                    {" "}
                    (your name, can be fictional)
                </small>
            </label>
            <Input
                id="name"
                value={name}
                onChange={(e) => setName(e)}
                placeholder="24 characters max"
                maxLength={24}
            />

            <hr />
            <label
                htmlFor="title"
                className="flex items-center"
            >
                <b>Title</b>
                <small className="ml-auto text-ellipsis-left">
                    (a short phrase that feels yours)
                </small>
            </label>
            <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e)}
                placeholder="24 characters max"
                maxLength={24}
            />

            <hr />
            <label
                htmlFor="status"
                className="flex items-center"
            >
                <b>Status</b>
                <small className="ml-auto text-ellipsis-left">
                    (a short text capturing your mood)
                </small>
            </label>
            <Input
                id="status"
                value={status}
                onChange={(e) => setStatus(e)}
                maxLength={48}
                placeholder="48 characters max"
            />

            <hr />
            <label
                htmlFor="bio"
                className="flex items-center"
            >
                <b>Bio</b>
                <small className="ml-auto text-ellipsis-left">
                    {" "}
                    (a long piece of text, describe yourself)
                </small>
            </label>
            <Input
                value={bio}
                onChange={(e) => setBio(e)}
                placeholder="128 characters max"
                maxLength={128}
            />

            <hr className="mt-auto" />

            <Tooltip
                text="Save all of your changes"
                className="w-full"
                direction="top"
            >
                <Button
                    type="submit"
                    className="w-full"
                >
                    {promiseStatus(promises.updateUser)}
                    <Image
                        src="/send.svg"
                        width={20}
                        height={20}
                        alt=""
                    />
                    Apply changes
                </Button>
            </Tooltip>
        </form>
    );
};
