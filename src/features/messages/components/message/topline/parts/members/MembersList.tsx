import { MemberSettings } from "@/features/messages/components/message/topline/parts/members/MemberSettings";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { Spinner } from "@/features/ui/spinner/components/Spinner";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    conversationData: CacheAPIProtocol["conversations"]["data"][number];
};

export const MembersList = ({ conversationData }: Props) => {
    const { data, isLoading } = useQuery({
        key: ["conversation_members", conversationData.id],
        revalidate: true,
    });

    if (isLoading || !data) {
        return (
            <div className="flex flex-col gap-2 justify-between relative">
                {Array.from({ length: 8 }, (_, k) => (
                    <div
                        key={k}
                        className="w-full h-6 loading"
                    />
                ))}

                <Spinner className="absolute left-1/2 top-1/2 -translate-1/2" />
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-2 items-center">
            {data.map((m) => (
                <li
                    key={m.user.id}
                    className="flex items-center gap-4 w-full! relative"
                >
                    <LinkButton
                        href={`/profile/${m.user.username}`}
                        className="w-full justify-start! gap-4! p-2!"
                    >
                        <ProfileImage
                            width={256}
                            height={256}
                            profile={m.user.profile}
                            className="w-8! h-8!"
                        />

                        <span>{m.user.username}</span>
                    </LinkButton>

                    <ul className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                        <li className="select-none">
                            <span>
                                <small className="flex items-center gap-1">
                                    <Image
                                        alt=""
                                        width={16}
                                        height={16}
                                        src="/calendar.svg"
                                    />
                                    {relativeTime(m.user.last_seen_at)}
                                </small>
                            </span>
                        </li>

                        <li className="pointer-events-auto">
                            <Modal
                                direction="top"
                                tooltipClassName="w-screen max-w-64"
                                element={() => <MemberSettings data={m}/>}
                            >
                                <Tooltip text="Configure member">
                                    <Button>
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/settings.svg"
                                        />
                                    </Button>
                                </Tooltip>
                            </Modal>
                        </li>
                    </ul>
                </li>
            ))}
        </ul>
    );
};
