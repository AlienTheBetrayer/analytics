import { MiniProfileModal } from "@/features/messages/components/message/topline/miniprofile/MiniProfileModal";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { Modal } from "@/features/ui/popovers/components/modal/Modal";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";
import { useParams } from "next/navigation";

export type MiniProfileProps =
    | {
          type: "conversation";
          data: CacheAPIProtocol["conversations"]["data"][number];
      }
    | {
          type: "retrieved";
          data: CacheAPIProtocol["conversation_retrieve"]["data"];
      }
    | {
          type: "unknown";
      }
    | {
          type: "notes";
          data?: CacheAPIProtocol["conversations"]["data"][number];
      };

export const MiniProfile = (props: MiniProfileProps) => {
    return (
        <Modal
            tooltipClassName="w-screen max-w-96"
            direction="bottom-right"
            element={() => <MiniProfileModal {...props} />}
        >
            <Tooltip
                direction="top"
                text="Detailed information"
            >
                <Button className="gap-1! p-0!">
                    <MiniProfileView {...props} />
                </Button>
            </Tooltip>
        </Modal>
    );
};

export const MiniProfileView = (props: MiniProfileProps) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { id, extra } = useParams<{ id?: string; extra?: string }>();

    switch (props.type) {
        case "conversation": {
            switch (props.data.type) {
                case "dm": {
                    const user = props.data.conversation_members.find(
                        (m) => m.user_id !== status?.id,
                    )?.user;

                    return (
                        <span className="flex items-center gap-1 self-stretch px-2!">
                            <div className="w-1 h-1 rounded-full bg-blue-1" />
                            <ProfileImage
                                profile={user?.profile}
                                width={256}
                                height={256}
                                className="w-5! h-5!"
                            />
                            <span>{user?.username}</span>
                            <span>
                                <small>
                                    {relativeTime(user?.last_seen_at)}
                                </small>
                            </span>
                        </span>
                    );
                }

                case "channel": {
                    return (
                        <span className="flex items-center gap-1 self-stretch px-2!">
                            <div className="w-1 h-1 rounded-full bg-blue-1" />
                            {props.data.image_url ? (
                                <Image
                                    alt=""
                                    width={24}
                                    height={24}
                                    src={props.data.image_url}
                            className="invert-0! rounded-full w-6! h-6!"
                                />
                            ) : (
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/friends.svg"
                                />
                            )}
                            Channel
                        </span>
                    );
                }
                case "group": {
                    return (
                        <span className="flex items-center gap-1 self-stretch px-2!">
                            <div className="w-1 h-1 rounded-full bg-blue-1" />
                            {props.data.image_url ? (
                                <Image
                                    alt=""
                                    width={24}
                                    height={24}
                                    src={props.data.image_url}
                            className="invert-0! rounded-full w-6! h-6!"
                                />
                            ) : (
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/friends.svg"
                                />
                            )}
                            Group
                        </span>
                    );
                }
            }
        }
        case "notes": {
            return (
                <span className="flex items-center gap-1 self-stretch px-2!">
                    <div className="w-1 h-1 rounded-full bg-blue-1" />
                    {props.data?.image_url ? (
                        <Image
                            alt="notes"
                            width={24}
                            height={24}
                            src={props.data.image_url}
                            className="invert-0! rounded-full w-6! h-6!"
                        />
                    ) : (
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src={
                                extra
                                    ? "/cube.svg"
                                    : id === "board"
                                      ? "/dashboard.svg"
                                      : "/save.svg"
                            }
                        />
                    )}

                    {extra ? "Note" : id === "board" ? "Noteboard" : "Notes"}
                </span>
            );
        }
        case "retrieved": {
            return (
                <span className="flex items-center gap-1 self-stretch px-2!">
                    <div className="w-1 h-1 rounded-full bg-orange-1" />
                    <ProfileImage
                        profile={props.data.user?.profile}
                        width={256}
                        height={256}
                        className="w-5! h-5!"
                    />
                    <span>{props.data?.user?.username}</span>
                    <span>
                        <small>
                            {relativeTime(props.data?.user?.last_seen_at)}
                        </small>
                    </span>
                </span>
            );
        }
        case "unknown": {
            return (
                <span className="loading flex items-center gap-1 self-stretch px-2!">
                    <div className="w-1 h-1 rounded-full bg-red-1" />
                    <span>Unknown</span>
                </span>
            );
        }
    }
};
