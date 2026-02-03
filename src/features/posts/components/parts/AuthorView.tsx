import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    id: string;
};

export const AuthorView = ({ id }: Props) => {
    // fetching
    const { data: user, isLoading } = useQuery({ key: ["user", id] });

    if (isLoading) {
        return (
            <div className="box items-center! p-4! w-screen max-w-64 loading" />
        );
    }

    if (!user) {
        return (
            <div className="box items-center! p-4! w-screen max-w-64">
                <span className="m-auto!">Absent data</span>
            </div>
        );
    }

    return (
        <div className="box items-center! p-4! w-screen max-w-64">
            <span>{user.username}</span>

            <ProfileImage
                width={256}
                height={256}
                profile={user.profile}
                className="w-full max-w-16"
            />

            <LinkButton
                href={`/profile/${user.username}`}
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
        </div>
    );
};
