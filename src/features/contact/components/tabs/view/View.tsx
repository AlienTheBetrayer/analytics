import { NoMessage } from "@/features/contact/components/errors/NoMessage";
import { PreviewButton } from "@/features/contact/components/parts/PreviewButton";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useMessageBox } from "@/features/ui/messagebox/hooks/useMessageBox";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { deleteContact } from "@/query-api/calls/contact";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { redirect, useParams } from "next/navigation";

export const View = () => {
    // url
    const { id } = useParams<{ id?: string }>();

    // fetching
    const { data, isLoading } = useQuery({ key: ["contact_message", id] });
    const { data: status } = useQuery({ key: ["status"] });

    const deleteBox = useMessageBox();

    return (
        <div className="flex flex-col grow! w-full gap-2!">
            {deleteBox.render({
                children:
                    "This message will be permanently deleted and we won't be able to see it.",
                onSelect: (res) => {
                    if (res === "yes") {
                        if (!data) {
                            return;
                        }

                        wrapPromise("deleteContact", () => {
                            return deleteContact({
                                user_id: data.user_id,
                                message_id: data.id,
                            });
                        }).then(() => redirect("/contact/list"));
                    }
                },
            })}
            <ul
                className={`box p-0! h-10! w-full items-center flex-row! ${!data ? "opacity-30" : ""}`}
                inert={!!!data}
            >
                <li>
                    <Tooltip text="Go back">
                        <LinkButton
                            ariaLabel="back"
                            href="/contact/list"
                        >
                            <Image
                                alt="back"
                                width={16}
                                height={16}
                                src="/back.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>

                <li className="ml-auto!">
                    <Tooltip
                        text="Edit"
                        isEnabled={status?.id === data?.user_id}
                    >
                        <LinkButton
                            ariaLabel="edit"
                            href={`/contact/edit/${id}`}
                        >
                            <Image
                                alt="edit"
                                width={16}
                                height={16}
                                src="/pencil.svg"
                            />
                        </LinkButton>
                    </Tooltip>
                </li>

                <li>
                    <Tooltip
                        text="Unsend"
                        isEnabled={
                            status?.id === data?.user_id ||
                            status?.role === "admin" ||
                            status?.role === "op"
                        }
                    >
                        <Button
                            aria-label="delete"
                            onClick={deleteBox.show}
                        >
                            <PromiseState state="deleteContact" />
                            <Image
                                alt="delete"
                                width={16}
                                height={16}
                                src="/delete.svg"
                            />
                        </Button>
                    </Tooltip>
                </li>
            </ul>

            <ViewMessage
                data={data}
                isLoading={isLoading}
            />
        </div>
    );
};

type MessageProps = {
    data: CacheAPIProtocol["contact_message"]["data"] | null;
    isLoading: boolean;
};
const ViewMessage = ({ data, isLoading }: MessageProps) => {
    const { data: user, isLoading: userLoading } = useQuery({
        key: ["user", data?.user_id],
    });

    // fallbacks
    if (isLoading || userLoading) {
        return <div className="w-full loading h-64" />;
    }

    if (!data) {
        return (
            <div className="flex items-center justify-center w-full h-64 loading">
                <NoMessage />
            </div>
        );
    }

    return (
        <PreviewButton
            expanded
            username={user?.username}
            type="message"
            data={data}
            contents={{ ...data }}
            avatar_color={user?.profile.color}
            avatar_url={user?.profile.avatar_url}
        />
    );
};
