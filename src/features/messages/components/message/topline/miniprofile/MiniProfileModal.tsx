import { Date } from "@/features/messages/components/message/topline/miniprofile/Date";
import { MiniProfileProps } from "@/features/messages/components/message/topline/miniprofile/MiniProfile";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { UnknownConversation } from "@/features/messages/components/errors/UnknownConversation";
import { InfoRetrieved } from "@/features/messages/components/errors/InfoRetrieved";
import { useParams } from "next/navigation";
import { TabSelection } from "@/utils/other/TabSelection";

export const MiniProfileModal = (props: MiniProfileProps) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { id } = useParams<{ id?: string }>();

    switch (props.type) {
        case "conversation": {
            return (
                <div className="box items-center! acrylic p-4! w-full rounded-3xl!">
                    <Tooltip
                        direction="top"
                        element={<Date data={props.data} />}
                        className="absolute top-2 right-11 p-0!"
                    >
                        <Button className="rounded-lg! w-6! h-6! min-h-6! min-w-6! p-0!">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/calendar.svg"
                            />
                        </Button>
                    </Tooltip>

                    {(() => {
                        switch (props.data.type) {
                            case "dm": {
                                const user =
                                    props.data.conversation_members.find(
                                        (m) => m.user_id !== status?.id,
                                    )?.user;

                                return (
                                    <>
                                        <span className="flex items-center gap-1">
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/account.svg"
                                            />
                                            <div className="w-1 h-1 rounded-full bg-blue-1" />

                                            <span>{user?.username}</span>
                                        </span>

                                        <div className="flex flex-col items-center w-full">
                                            <LinkButton
                                                href={`/profile/${user?.username}`}
                                                className="not-hover:bg-transparent! border-0! w-full rounded-2xl!"
                                            >
                                                <ProfileImage
                                                    profile={user?.profile}
                                                    width={256}
                                                    height={256}
                                                    className="w-32! h-32!"
                                                />
                                            </LinkButton>
                                        </div>

                                        {props.data.description && (
                                            <small className="flex items-center gap-1">
                                                <Image
                                                    alt=""
                                                    width={16}
                                                    height={16}
                                                    src="/description.svg"
                                                />
                                                <span>
                                                    {props.data.description}
                                                </span>
                                            </small>
                                        )}

                                        <LinkButton
                                            href={`/profile/${user?.username}`}
                                            className="w-full"
                                        >
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/launch.svg"
                                            />
                                            Profile
                                        </LinkButton>
                                    </>
                                );
                            }
                            default: {
                                return (
                                    <>
                                        <span className="flex items-center gap-1">
                                            <Image
                                                alt=""
                                                width={16}
                                                height={16}
                                                src="/friends.svg"
                                            />
                                            <div className="w-1 h-1 rounded-full bg-blue-1" />
                                            <span>
                                                {props.data.title ||
                                                    (props.data.type === "group"
                                                        ? "Group"
                                                        : "Channel")}
                                            </span>
                                        </span>

                                        <div className="rounded-full! overflow-hidden w-32 aspect-square relative loading">
                                            {props.data.image_url ? (
                                                <Image
                                                    alt=""
                                                    fill
                                                    style={{
                                                        objectFit: "cover",
                                                    }}
                                                    className="invert-0!"
                                                    src={props.data.image_url}
                                                />
                                            ) : (
                                                <Image
                                                    alt={
                                                        props.data.type ===
                                                        "group"
                                                            ? "Group"
                                                            : "Channel"
                                                    }
                                                    src="/friends.svg"
                                                    fill
                                                />
                                            )}
                                        </div>

                                        {props.data.description && (
                                            <small className="flex items-center gap-1">
                                                <Image
                                                    alt=""
                                                    width={16}
                                                    height={16}
                                                    src="/description.svg"
                                                />
                                                <span>
                                                    {props.data.description}
                                                </span>
                                            </small>
                                        )}
                                    </>
                                );
                            }
                        }
                    })()}
                </div>
            );
        }
        case "notes": {
            return (
                <div className="box items-center acrylic p-4! w-screen max-w-96 rounded-3xl!">
                    <span className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/save.svg"
                        />
                        <span>{props.data?.title || "Notes"}</span>
                    </span>

                    {props.data && (
                        <Tooltip
                            direction="top"
                            pointerEvents
                            element={<Date data={props.data} />}
                            className="absolute top-2 right-11 p-0!"
                        >
                            <Button className="rounded-lg! w-6! h-6! min-h-6! min-w-6! p-0!">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/calendar.svg"
                                />
                            </Button>
                        </Tooltip>
                    )}

                    <div className="grid grid-cols-2 gap-4 w-full max-w-64">
                        <LinkButton
                            href="/messages/notes"
                            className="loading aspect-square flex-col!"
                        >
                            {props.data?.image_url ? (
                                <Image
                                    alt=""
                                    fill
                                    style={{ objectFit: "cover" }}
                                    src={props.data.image_url}
                                    className="invert-0!"
                                />
                            ) : (
                                <Image
                                    alt=""
                                    src="/save.svg"
                                    width={32}
                                    height={32}
                                />
                            )}

                            <span className="flex items-center gap-1 z-1">
                                Messages
                                <TabSelection
                                    condition={id !== "board"}
                                    className="right-3 top-3"
                                />
                            </span>
                        </LinkButton>

                        <LinkButton
                            href="/messages/notes/board"
                            className="loading aspect-square flex-col!"
                        >
                            <Image
                                alt="notes"
                                width={32}
                                height={32}
                                src="/dashboard.svg"
                            />
                            <span className="flex items-center gap-1">
                                Notes
                            </span>
                            <TabSelection
                                condition={id === "board"}
                                className="right-3 top-3"
                            />
                        </LinkButton>
                    </div>

                    {props.data?.description && (
                        <>
                            <hr />
                            <small className="flex items-center gap-1">
                                <Image
                                    alt=""
                                    width={16}
                                    height={16}
                                    src="/description.svg"
                                />
                                <span>{props.data.description}</span>
                            </small>
                        </>
                    )}
                </div>
            );
        }
        case "retrieved": {
            return (
                <div className="box items-center acrylic p-4! w-screen max-w-96 rounded-3xl!">
                    <Tooltip
                        direction="top"
                        text="No conversation yet"
                        className="absolute top-2 right-11 p-0!"
                    >
                        <Button className="rounded-lg! w-6! h-6! min-h-6! min-w-6! p-0!">
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src="/help.svg"
                            />
                        </Button>
                    </Tooltip>

                    <span className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-red-1" />
                        {props.data.user?.username}
                    </span>
                    <LinkButton
                        href={`/profile/${props.data.user?.username}`}
                        className="not-hover:bg-transparent! border-0! w-full rounded-2xl!"
                    >
                        <ProfileImage
                            profile={props.data.user?.profile}
                            width={256}
                            height={256}
                            className="w-32! h-32!"
                        />
                    </LinkButton>

                    <div className="p-4 loading">
                        <InfoRetrieved />
                    </div>
                </div>
            );
        }
        case "unknown": {
            return (
                <div className="box acrylic p-4! w-screen max-w-96 min-h-48 justify-center loading rounded-3xl!">
                    <UnknownConversation />
                </div>
            );
        }
    }
};
