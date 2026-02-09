import { PreviewButton } from "@/features/contact/components/parts/PreviewButton";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";
import { queryCache } from "@/query/init";
import { ContactMessage } from "@/types/tables/contact";
import { relativeTime } from "@/utils/other/relativeTime";
import { TabSelection } from "@/utils/other/TabSelection";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

type Props = {
    id: string;
    filter?: string;
    className?: string;
};

export const Item = ({ className, id, filter }: Props) => {
    // local store
    const display = useLocalStore(
        (state) => state.display.view.contactMessages,
    );

    // fetching
    const { data, isLoading } = useQuery({ key: ["contact_message", id] });
    const { data: user } = useQuery({ key: ["user", data?.user_id] });
    const { data: status } = useQuery({ key: ["status"] });

    if (isLoading) {
        return <div className="w-full min-h-32 loading rounded-4xl!" />;
    }

    if (!data) {
        return null;
    }

    if (
        filter &&
        !data.title.trim().toLowerCase().includes(filter.trim().toLowerCase())
    ) {
        return null;
    }

    return (
        <div className="flex flex-col">
            <ul
                className={`box bg-bg-2! h-10! flex-row! gap-1! items-center! justify-start! p-0! ${display !== "compact" ? "rounded-b-none! px-3!" : ""}`}
            >
                {display !== "compact" && (
                    <li>
                        <LinkButton href={`/contact/view/${id}`}>
                            <Image
                                alt="view"
                                width={16}
                                height={16}
                                src="/launch.svg"
                            />
                            <TabSelection
                                condition={!!data.response}
                                color="var(--orange-1)"
                            />
                        </LinkButton>
                    </li>
                )}

                {display === "compact" && (
                    <li className="w-full">
                        <LinkButton
                            className="grid! grid-cols-[6rem_auto_1fr_auto] w-full gap-1! whitespace-nowrap"
                            href={`/contact/view/${id}`}
                        >
                            <div className="flex items-center gap-1 box p-0.5! flex-row! bg-bg-3! truncate">
                                <ProfileImage
                                    profile={user?.profile}
                                    width={256}
                                    height={256}
                                    className="w-5! h-5!"
                                />
                                <span>{user?.username}</span>
                                <TabSelection
                                    condition={!!data.response}
                                    color="var(--orange-1)"
                                />
                            </div>

                            <hr className="w-px! h-1/2!" />

                            <span className="truncate">{data.title}</span>

                            <span className="flex items-center gap-1 ml-auto! whitespace-nowrap">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/imageadd.svg"
                                />
                                {relativeTime(data.created_at)}
                            </span>
                        </LinkButton>
                    </li>
                )}

                <li className="ml-auto!">
                    <ul className="flex items-center gap-1">
                        {status?.id ===
                            (
                                queryCache.get({
                                    key: ["contact_message", id],
                                }) as ContactMessage
                            )?.user_id && (
                            <li>
                                <Tooltip text="Edit message">
                                    <LinkButton href={`/contact/edit/${id}`}>
                                        <Image
                                            alt="edit"
                                            width={16}
                                            height={16}
                                            src="/pencil.svg"
                                        />
                                    </LinkButton>
                                </Tooltip>
                            </li>
                        )}
                    </ul>
                </li>
            </ul>

            <div
                className="transition-all duration-500 overflow-hidden"
                style={{
                    height: display === "compact" ? "0" : "auto",
                    interpolateSize: "allow-keywords",
                }}
            >
                <PreviewButton
                    className={className}
                    type="message"
                    expanded={false}
                    avatar_color={user?.profile.color}
                    contents={data}
                    data={data}
                    username={user?.username}
                    avatar_url={user?.profile.avatar_url}
                />
            </div>
        </div>
    );
};
