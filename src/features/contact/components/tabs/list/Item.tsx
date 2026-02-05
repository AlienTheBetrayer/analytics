import { PreviewButton } from "@/features/contact/components/parts/PreviewButton";
import { useQuery } from "@/query/core";

type Props = {
    id: string;
    filter?: string;
    className?: string;
};

export const Item = ({ className, id, filter }: Props) => {
    // fetching
    const { data, isLoading } = useQuery({ key: ["contact_message", id] });
    const { data: user } = useQuery({ key: ["user", data?.user_id] });

    if (isLoading) {
        return <li className="w-full min-h-32 loading rounded-4xl!" />;
    }

    if (!data) {
        return null;
    }

    if (filter && !data.title.includes(filter.trim().toLowerCase())) {
        return null;
    }

    return (
        <li>
            <PreviewButton
                className={className}
                type="message"
                expanded={false}
                avatar_color={user?.profile.color}
                contents={data}
                username={user?.username}
                avatar_url={user?.profile.avatar_url}
            />
        </li>
    );
};
