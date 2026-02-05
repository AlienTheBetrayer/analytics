import { useQuery } from "@/query/core";

type Props = {
    id: string;
};

export const Item = ({ id }: Props) => {
    // fetching
    const { data, isLoading } = useQuery({ key: ["contact_message", id] });
    const { data: user } = useQuery({ key: ["user", data?.user_id] });

    if (isLoading) {
        return <li className="w-full min-h-32 loading rounded-4xl!" />;
    }

    if (!data) {
        return null;
    }

    return <li>{data.title}</li>;
};
