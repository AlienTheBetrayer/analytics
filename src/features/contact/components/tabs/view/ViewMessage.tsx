import { NoMessage } from "@/features/contact/components/errors/NoMessage";
import { PreviewButton } from "@/features/contact/components/parts/PreviewButton";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";

type Props = {
    data: CacheAPIProtocol["contact_message"]["data"] | null;
    isLoading: boolean;
};
export const ViewMessage = ({ data, isLoading }: Props) => {
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
