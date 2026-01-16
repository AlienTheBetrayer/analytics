import { Profile, User } from "@/types/tables/account";

type Props = {
    data: { user: User; profile: Profile }[];
};

export const Results = ({ data }: Props) => {
    return (
        <ul>
            {data.map(({ user, profile }) => (
                <li key={user.id}>{user.username}</li>
            ))}
        </ul>
    );
};
