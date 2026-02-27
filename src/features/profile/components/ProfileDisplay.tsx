import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { relativeTime } from "@/utils/other/relativeTime";
import { ProfileImage } from "./ProfileImage";
import { useQuery } from "@/query/core";

type Props = {
    id: string;
};

export const ProfileDisplay = ({ id }: Props) => {
    // fetching
    const { data, isLoading } = useQuery({ key: ["user", id] });

    if (isLoading) {
        return <div className="w-full h-8 loading" />;
    }

    if (!data) {
        return null;
    }

    return (
        <LinkButton
            href={`/profile/${data.username}`}
            className="justify-start! px-4! py-2! h-full rounded-3xl!"
        >
            <ul className="flex flex-col w-full! lg:flex-row gap-2 items-center! justify-start! text-center">
                <li>
                    <ProfileImage
                        className="mt-6 lg:mt-0 w-16! h-16! lg:w-8! lg:h-8!"
                        profile={data.profile}
                        width={40}
                        height={40}
                    />
                </li>

                <li>
                    <hr className="lg:w-px! lg:h-full!" />
                </li>

                <li>
                    <div className="grid grid-flow-col gap-2">
                        <span className="flex items-center gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/account.svg"
                            />
                            <span>{data.username}</span>
                        </span>

                        {data.profile.title && (
                            <>
                                <hr className="w-px! h-3/4! my-auto!" />
                                <span className="flex items-center gap-1">
                                    <Image
                                        alt=""
                                        width={12}
                                        height={12}
                                        src="/menu.svg"
                                    />

                                    {data.profile.title}
                                </span>
                            </>
                        )}
                    </div>
                </li>

                <li className="lg:ml-auto! absolute lg:static">
                    <span className="flex gap-1 items-center">
                        <Image
                            src="/calendar.svg"
                            width={14}
                            height={14}
                            alt=""
                        />
                        seen {relativeTime(data.last_seen_at)}
                    </span>
                </li>
            </ul>
        </LinkButton>
    );
};
