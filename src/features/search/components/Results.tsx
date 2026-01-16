import { ProfileDisplay } from "@/features/search/components/ProfileDisplay";
import { Profile, User } from "@/types/tables/account";

type Props = {
    data: { user: User; profile: Profile }[];
};

export const Results = ({ data }: Props) => {
    return (
        <ul className="flex flex-col gap-4">
            {data.map(({ user, profile }) => (
                <li key={user.id}>
                    <ProfileDisplay data={{ user, profile }} />
                </li>
            ))}
        </ul>
    );
};
