import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
import { AnimatePresence, motion } from "motion/react";
import { Colors } from "../../modals/Colors";
import { ProfileImage } from "../../ProfileImage";
import React, { JSX, useRef } from "react";
import Image from "next/image";
import { ColorSwatches } from "../../parts/ColorSwatches";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

export type EditAvatarProps = {
    data: CacheAPIProtocol["user"]["data"];
    avatar: [
        string | null | undefined,
        React.Dispatch<React.SetStateAction<string | null | undefined>>,
    ];
    fileError: [
        JSX.Element | undefined,
        React.Dispatch<React.SetStateAction<JSX.Element | undefined>>,
    ];
    avatarFile: [
        File | undefined,
        React.Dispatch<React.SetStateAction<File | undefined>>,
    ];
};

export const Avatar = ({
    data,
    fileError,
    avatarFile,
    avatar,
}: EditAvatarProps) => {
    // fetching
    const { data: colors } = useQuery({ key: ["colors", data.id] });

    // refs
    const inputRef = useRef<HTMLInputElement | null>(null);

    // derived states
    const avatarImage = avatarFile[0]
        ? URL.createObjectURL(avatarFile[0])
        : avatar[0];

    // messageboxes
    const avatarBox = useMessageBox();

    return (
        <div className="flex flex-col items-center gap-2">
            {avatarBox.render({
                children:
                    "Your account will lose its profile picture until you set it again",
                onSelect: (res) => {
                    if (res === "yes") {
                        avatarFile[1](undefined);
                        avatar[1](null);
                    }
                },
            })}

            <span>{data.profile.name}</span>

            <Tooltip
                text="Change your profile image"
                direction="top"
            >
                <div
                    style={{
                        borderColor: data.profile.color ?? "#fff",
                    }}
                    className="profile-frame relative w-full max-w-64 aspect-square rounded-full overflow-hidden 
                    duration-300 ease-out"
                >
                    <ProfileImage
                        src={avatarImage ?? ""}
                        width={256}
                        height={256}
                        profile={data.profile}
                    />

                    <label
                        htmlFor="profile-avatar"
                        className="absolute duration-300 ease-out transition-all border-4 border-transparent 
                            focus-within:border-blue-1 hover:border-blue-1 left-0 top-0 flex rounded-full w-full h-full aspect-square cursor-pointer z-100"
                    >
                        <input
                            ref={inputRef}
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;

                                // > 0.5 MB error handling
                                if (file.size / 1024 / 1024 > 0.5) {
                                    fileError[1](
                                        <>
                                            Size has to be
                                            <u> less </u>
                                            than{" "}
                                            <mark>
                                                <b>0.5 MB!</b>
                                            </mark>
                                        </>,
                                    );
                                    setTimeout(() => {
                                        fileError[1](undefined);
                                    }, 10000);
                                    return;
                                }

                                avatarFile[1](file);
                            }}
                            id="profile-avatar"
                            type="file"
                            accept="image/*"
                            className="absolute left-0 top-0 w-0 h-0 opacity-0"
                        />
                    </label>
                </div>
            </Tooltip>

            <AnimatePresence>
                {fileError[0] && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                    >
                        <span>{fileError[0]}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex gap-1 w-full max-w-48">
                {avatarFile[0] ? (
                    <Tooltip
                        text="Cancel image changing"
                        className="w-full"
                    >
                        <Button
                            onClick={() => {
                                avatarFile[1](undefined);
                            }}
                            className="w-full"
                        >
                            <Image
                                src="/cross.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            Cancel
                        </Button>
                    </Tooltip>
                ) : avatar[0] ? (
                    <Tooltip
                        text="Wipe profile image"
                        className="w-full"
                    >
                        <Button
                            onClick={() => {
                                avatarBox.show();
                            }}
                            className="w-full"
                        >
                            <Image
                                src="/delete.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            Delete image
                        </Button>
                    </Tooltip>
                ) : (
                    <Tooltip
                        text="Set a profile image"
                        className="w-full"
                    >
                        <Button
                            onClick={() => {
                                inputRef.current?.click();
                            }}
                            className="w-full"
                        >
                            <Image
                                src="/imageadd.svg"
                                width={16}
                                height={16}
                                alt=""
                            />
                            Set image
                        </Button>
                    </Tooltip>
                )}
            </div>

            <Tooltip
                text="Modify your color palette"
                className="w-full mt-auto!"
                direction="top"
            >
                <Modal
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
        </div>
    );
};
