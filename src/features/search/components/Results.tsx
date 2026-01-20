import { ProfileDisplay } from "@/features/search/components/ProfileDisplay";
import { Profile, User } from "@/types/tables/account";
import Image from "next/image";

type Props = {
    data: { user: User; profile: Profile }[];
};

export const Results = ({ data }: Props) => {
    return (
        <ul className="flex flex-col gap-4">
            <li className="flex items-center gap-2 self-center">
                <div className="rounded-full aspect-square p-1.5 outline-2 outline-blue-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/book.svg"
                    />
                </div>
                <span>
                    Found {data.length} user{data.length === 1 ? "" : "s"}
                </span>
            </li>

            <li className="w-1/3 self-center">
                <hr />
            </li>

            {data.map(({ user, profile }) => (
                <li key={user.id}>
                    <ProfileDisplay data={{ user, profile }} />
                </li>
            ))}
        </ul>
    );
};
