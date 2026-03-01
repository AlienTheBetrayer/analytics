import "./Edit.css";
import { useState } from "react";

import Image from "next/image";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { wrapPromise } from "@/promises/core";
import { ProfileGender } from "@/types/tables/account";
import { updateUser } from "@/query-api/calls/users";
import { ImageSelectCircle } from "@/features/ui/imageselectcircle/components/ImageSelectCircle";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { capitalize } from "@/utils/other/capitalize";
import { Colors } from "@/features/profile/components/modals/Colors";
import { ColorSwatches } from "@/features/profile/components/parts/ColorSwatches";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { useQuery } from "@/query/core";
import { Select } from "@/features/ui/select/components/Select";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const Edit = ({ data }: Props) => {
    // react states
    const [status, setStatus] = useState<string>(data.profile.status ?? "");
    const [name, setName] = useState<string>(data.profile.name ?? "");
    const [bio, setBio] = useState<string>(data.profile.bio ?? "");
    const [title, setTitle] = useState<string>(data.profile.title ?? "");
    const [gender, setGender] = useState<ProfileGender>(
        data.profile.gender ?? "unspecified",
    );
    const [avatar, setAvatar] = useState<string>(data.profile.avatar_url ?? "");
    const [avatarFile, setAvatarFile] = useState<File | undefined | null>(
        undefined,
    );

    // fetching
    const { data: colors } = useQuery({ key: ["colors", data.id] });

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

            <form
                className="grid lg:grid-cols-[30%_1fr] gap-16 lg:gap-8 grow"
                onSubmit={async (e) => {
                    e.preventDefault();

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
                                ...(avatarFile !== undefined && {
                                    image: avatarFile,
                                }),
                            },
                        });
                    });
                }}
            >
                <ul className="flex flex-col gap-4">
                    <li className="flex flex-col items-center justify-center gap-2 grow">
                        <ImageSelectCircle
                            className="w-screen max-w-48 aspect-square"
                            value={avatar}
                            onChange={(file) => {
                                setAvatar(
                                    file ? URL.createObjectURL(file) : "",
                                );
                                setAvatarFile(file);
                            }}
                        />
                    </li>

                    <li>
                        <Tooltip
                            text="Modify your color palette"
                            className="w-full mt-auto!"
                            direction="top"
                        >
                            <Modal
                                tooltipClassName="w-screen max-w-lg"
                                direction="top"
                                element={() => <Colors data={data} />}
                                className="w-full"
                            >
                                <Button className="w-full! max-w-81 lg:max-w-full mx-auto min-h-9! flex flex-col!">
                                    {colors ? (
                                        <ColorSwatches data={data} />
                                    ) : (
                                        <div className="flex gap-1 items-center">
                                            <Image
                                                src="/cube.svg"
                                                width={16}
                                                height={16}
                                                alt=""
                                            />
                                            Color panel
                                        </div>
                                    )}
                                </Button>
                            </Modal>
                        </Tooltip>
                    </li>
                </ul>

                <ul className="flex flex-col gap-4">
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
                                    <small className="ml-auto truncate-left">
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
                                    <small className="ml-auto truncate-left">
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
                            <small className="ml-auto truncate-left">
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
                            <small className="ml-auto truncate-left">
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
                            <small className="ml-auto truncate-left">
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
        </div>
    );
};
