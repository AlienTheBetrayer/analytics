import { PreviewButton } from "@/features/contact/components/parts/PreviewButton";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";
import { queryCache } from "@/query/init";
import { ContactMessage } from "@/types/tables/contact";
import Image from "next/image";

type Props = {
    id: string;
    filter?: string;
    className?: string;
};

export const Item = ({ className, id, filter }: Props) => {
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
            <ul className="box h-10! px-3! flex-row! gap-1! items-center! justify-start! p-0! rounded-b-none!">
                <li>
                    <LinkButton href={`/contact/view/${id}`}>
                        <Image
                            alt="view"
                            width={16}
                            height={16}
                            src="/launch.svg"
                        />
                    </LinkButton>
                </li>

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
    );
};
