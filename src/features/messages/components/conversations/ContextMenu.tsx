import "../message/ContextMenu.css";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["conversations"]["data"][number];
};

export const ContextMenu = ({ data }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });

    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-55 message-ctx">
            {data.type === "dm" && (
                <li className="mt-6!">
                    <LinkButton
                        href={`/profile/${data.conversation_members.find((m) => m.user_id !== status?.id)?.user.username}`}
                    >
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/account.svg"
                        />
                        <span>Profile</span>
                    </LinkButton>
                </li>
            )}

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/archive.svg"
                    />
                    <span>Archive</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/pin.svg"
                    />
                    <span>Pin</span>
                </Button>
            </li>

            <li>
                <Button>
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/delete.svg"
                    />
                    <span>
                        <u>Delete</u>
                    </span>
                </Button>
            </li>
        </ul>
    );
};
