import { AlreadyMember } from "@/features/join/components/errors/AlreadyMember";
import { NotAMember } from "@/features/join/components/errors/NotAMember";
import { ThreeContainer } from "@/features/threecontainer/components/ThreeContainer";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { PromiseState } from "@/promises/components/PromiseState";
import { wrapPromise } from "@/promises/core";
import { updateConversationMembers } from "@/query-api/calls/conversation_members";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { redirect } from "next/navigation";

type Props = {
    data: CacheAPIProtocol["invitation"]["data"];
};

export const JoinDisplay = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <article className="box p-4! gap-4! w-full grow">
            <span className="flex items-center gap-1 mx-auto">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/send.svg"
                />
                Invitation
            </span>

            <div className="flex rounded-4xl overflow-hidden h-64 relative">
                {data.image_url ? (
                    <Image
                        alt=""
                        fill
                        style={{ objectFit: "cover" }}
                        src={data.image_url}
                        className="invert-0! hover:scale-105! duration-500!"
                    />
                ) : (
                    <ThreeContainer className="p-4! grow h-full" />
                )}

                {data.description && (
                    <div className="absolute bottom-2 left-4 right-4 flex items-center justify-center h-8 rounded-4xl bg-bg-2 z-300">
                        <span className="flex items-center gap-1">
                            <div className="w-1 h-1 rounded-full bg-blue-1" />
                            {data.description}
                        </span>
                    </div>
                )}
            </div>

            <div className="flex grow">
                <div className="loading p-4">
                    {data.isMember ? <AlreadyMember /> : <NotAMember />}
                </div>
            </div>

            <div className="flex flex-col items-center justify-center w-full *:w-full *:p-4! rounded-4xl">
                {data.isMember ? (
                    <LinkButton href={`/messages/c/${data.conversation_id}`}>
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/launch.svg"
                        />
                        View
                    </LinkButton>
                ) : (
                    <Button
                        onClick={() => {
                            if (!status) {
                                return null;
                            }

                            wrapPromise("addMembers", () => {
                                return updateConversationMembers({
                                    type: "add",
                                    conversation_id: data.conversation_id,
                                    user: status,
                                    user_ids: [status.id],
                                });
                            }).then(() => {
                                redirect(`/messages/c/${data.conversation_id}`);
                            });
                        }}
                        isEnabled={!!status}
                    >
                        <PromiseState state="addMembers" />
                        <div className="w-1 h-1 rounded-full bg-orange-1" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/auth.svg"
                        />
                        Join & Redirect
                    </Button>
                )}
            </div>
        </article>
    );
};
