import { ColorSwatches } from "@/features/profile/components/parts/ColorSwatches";
import { Gender } from "@/features/profile/components/parts/Gender";
import { Role } from "@/features/profile/components/parts/Role";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: CacheAPIProtocol["user"]["data"];
};

export const ProfileOverview = ({ data }: Props) => {
    const [field, setField] = useState<"Bio" | "Status" | null>(
        data.profile.bio ? "Bio" : data.profile.status ? "Status" : null,
    );

    return (
        <div className="flex flex-col gap-4">
            <ul className="flex flex-col items-center">
                <li>
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/account.svg"
                    />
                </li>
                <li>
                    <span>Profile:</span>
                </li>
            </ul>

            <ul className="flex flex-col w-full gap-4 grow items-center">
                <li className="flex flex-col items-center">
                    <span className="text-4! text-foreground-3!">
                        {data.profile.name}
                    </span>
                </li>

                <li className="w-3/12!">
                    <hr />
                </li>

                <li className="flex flex-col gap-2 items-center">
                    {data.profile.title && <span>{data.profile.title}</span>}

                    <ProfileImage
                        profile={data.profile}
                        width={256}
                        height={256}
                        className="w-full max-w-80 aspect-square hover:scale-102 outline-1 duration-500!"
                        style={{
                            outlineColor: data.profile.color ?? "transparent",
                        }}
                    />
                </li>

                <li>{data.profile.color && <ColorSwatches data={data} />}</li>

                <li>
                    <ul className="flex items-center gap-2">
                        {data.profile.gender && (
                            <li>
                                <Gender data={data} />
                            </li>
                        )}
                        <li>
                            <Role data={data} />
                        </li>
                    </ul>
                </li>

                <li className="w-3/12!">
                    <hr />
                </li>

                {(data.profile.bio || data.profile.status) && (
                    <li className="flex flex-col items-center gap-1">
                        <Button
                            isEnabled={!!(data.profile.bio && data.profile.status)}
                            onClick={() => {
                                setField((prev) =>
                                    prev === "Bio" ? "Status" : "Bio",
                                );
                            }}
                        >
                            <small className="flex gap-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/menu.svg"
                                />
                                <span>Field ({field})</span>
                            </small>
                        </Button>

                        <span>
                            {field === "Bio"
                                ? data.profile.bio
                                : data.profile.status}
                        </span>
                    </li>
                )}
            </ul>
        </div>
    );
};
