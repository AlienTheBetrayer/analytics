import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["invitations"]["data"][number];
};

export const InviteDisplay = ({ data }: Props) => {
    const deleteBox = useMessageBox();

    return (
        <article className={`box p-2! min-h-20 rounded-4xl! overflow-hidden items-center! flex-row!
        ${data.image_url ? "" : "loading"}`}>
            {deleteBox.render({
                children:
                    "Revoking this invitation will disallow everyone to use it!",
                onSelect: (res) => {
                    if (res === "yes") {
                    }
                },
            })}

            {data.image_url && (
                <Image
                    alt=""
                    fill
                    style={{ objectFit: "cover" }}
                    src={data.image_url}
                    className="invert-0!"
                />
            )}

            <div className="w-full h-full gap-4 z-1 flex rounded-4xl bg-bg-a-2 backdrop-blur-md p-2">
                <div className="flex flex-col items-center shrink-0">
                    <span>
                        <small className="flex items-center gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/account.svg"
                            />
                            From
                        </small>
                    </span>
                    <LinkButton href={`/profile/${data.user.username}`}>
                        <ProfileImage
                            profile={data.user.profile}
                            className="w-10! h-10!"
                            width={256}
                            height={256}
                        />
                    </LinkButton>
                </div>

                {data.description && (
                    <div className="flex flex-col overflow-hidden">
                        <span>
                            <small className="flex items-center gap-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/description.svg"
                                />
                                Desc.
                            </small>
                        </span>
                        <span className="truncate">{data.description}</span>
                    </div>
                )}

                <div className="flex flex-col items-end ml-auto">
                    <span>
                        <small className="flex items-center gap-1">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/calendar.svg"
                            />
                            Created
                        </small>
                    </span>
                    <span className="truncate">
                        {relativeTime(data.created_at)}
                    </span>
                </div>

                <div className="flex flex-col items-center gap-1 h-full">
                    <Tooltip
                        direction="right"
                        text="Copy URL"
                    >
                        <Button
                            onClick={() => {
                                wrapPromise("inviteCopy", () => {
                                    return navigator.clipboard.writeText(
                                        `/join/${data.id}`,
                                    );
                                });
                            }}
                        >
                            <PromiseState state="inviteCopy" />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/copy.svg"
                            />
                        </Button>
                    </Tooltip>

                    <Tooltip
                        direction="right"
                        text="Revoke"
                    >
                        <Button onClick={deleteBox.show}>
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                        </Button>
                    </Tooltip>
                </div>
            </div>
        </article>
    );
};
