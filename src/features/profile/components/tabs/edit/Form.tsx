import { fileToBase64 } from "@/features/profile/utils/fileToBase64";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { EditAvatarProps } from "./Avatar";
import { useState } from "react";
import Image from "next/image";
import { Select } from "@/features/ui/select/components/Select";
import { ProfileGender } from "@/types/tables/account";
import { capitalize } from "@/utils/other/capitalize";
import { PromiseState } from "@/promises/components/PromiseState";
import { updateUser } from "@/query-api/calls/users";
import { wrapPromise } from "@/promises/core";

export const Form = ({ avatar, avatarFile, data }: EditAvatarProps) => {
    // input states
    const [status, setStatus] = useState<string>(data.profile.status ?? "");
    const [name, setName] = useState<string>(data.profile.name ?? "");
    const [bio, setBio] = useState<string>(data.profile.bio ?? "");
    const [title, setTitle] = useState<string>(data.profile.title ?? "");
    const [gender, setGender] = useState<ProfileGender>(
        data.profile.gender ?? "unspecified",
    );

    return (
        <form
            className="flex flex-col grow"
            onSubmit={async (e) => {
                e.preventDefault();

                let dataAvatar = avatar[0];
                if (avatarFile?.[0]) {
                    dataAvatar = await fileToBase64(avatarFile?.[0]);
                }

                wrapPromise("updateUser", () => {
                    return updateUser({
                        id: data.id,
                        username: data.username,
                        data: {
                            status,
                            bio,
                            title,
                            name,
                            gender,
                            avatar_url: dataAvatar,
                            avatar_name: avatarFile?.[0]?.name,
                            avatar_type: avatarFile?.[0]?.type,
                        },
                    });
                });
            }}
        >
            <ul className="flex flex-col gap-8 grow">
                <li className="flex flex-col">
                    <ul className="grid md:grid-cols-2 gap-8 md:gap-4">
                        <li className="flex flex-col gap-2">
                            <label
                                htmlFor="name"
                                className="flex items-center gap-1"
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/pencil.svg"
                                />
                                Name
                                <small className="ml-auto text-ellipsis-left">
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
                        </li>

                        <li className="flex flex-col gap-2">
                            <label
                                htmlFor="title"
                                className="flex items-center gap-1"
                            >
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/type.svg"
                                />
                                Title
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
                        </li>
                    </ul>
                </li>

                <li className="flex flex-col gap-2">
                    <label
                        htmlFor="status"
                        className="flex items-center gap-1"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/menu.svg"
                        />
                        Status
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
                </li>

                <li className="flex flex-col gap-2">
                    <label
                        htmlFor="bio"
                        className="flex items-center gap-1"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/book.svg"
                        />
                        Bio
                        <small className="ml-auto text-ellipsis-left">
                            (a long piece of text, describe yourself)
                        </small>
                    </label>
                    <Input
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e)}
                        placeholder="128 characters max"
                        maxLength={128}
                    />
                </li>

                <li className="flex flex-col gap-2">
                    <label
                        htmlFor="gender"
                        className="flex items-center gap-1"
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/account.svg"
                        />
                        Gender
                        <small className="ml-auto text-ellipsis-left">
                            (the way you identify yourself)
                        </small>
                    </label>
                    <Select
                        id="gender"
                        items={["Male", "Female", "Other", "Unspecified"]}
                        value={capitalize(gender)}
                        onChange={(e) => {
                            setGender(e.toLowerCase() as ProfileGender);
                        }}
                    />
                </li>

                <li className="flex flex-col gap-2 mt-auto!">
                    <Tooltip
                        text="Save all of your changes"
                        className="w-full"
                        direction="top"
                    >
                        <Button
                            type="submit"
                            className="w-full"
                        >
                            <PromiseState state="updateUser" />
                            <Image
                                src="/send.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            Apply changes
                        </Button>
                    </Tooltip>
                </li>
            </ul>
        </form>
    );
};
