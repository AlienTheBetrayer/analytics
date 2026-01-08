import { Profile, User } from "@/types/tables/account";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile };
};

export const Title = ({ data }: Props) => {
    return (
        data.profile.title && (
            <div className="flex flex-col items-center">
                <small className="flex gap-1 items-center">
                    <Image
                        width={16}
                        height={16}
                        alt=""
                        src="/server.svg"
                    />
                    <span>Title</span>
                </small>
                <span className="text-foreground-5!">{data.profile.title}</span>
            </div>
        )
    );
};
