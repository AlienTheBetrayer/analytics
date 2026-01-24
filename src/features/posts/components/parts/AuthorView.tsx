import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Spinner } from "@/features/spinner/components/Spinner";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
    id: string;
};

export const AuthorView = ({ id }: Props) => {
    // zustand
    const profiles = useAppStore((state) => state.profiles);
    const users = useAppStore((state) => state.users);

    const user = users[id];
    const profile = profiles[id];

    return (
        <div className="box items-center! p-4! w-screen max-w-64">
            {profile && user ? (
                <>
                    <span>{user.username}</span>

                    <ProfileImage
                        width={256}
                        height={256}
                        profile={profiles[id]}
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
                </>
            ) : (
                <Spinner />
            )}
        </div>
    );
};
