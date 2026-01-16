import { Profile, User } from "@/types/tables/account";

type Props = {
    data: { user: User; profile: Profile }[];
};

export const Results = ({ data }: Props) => {
    return (
        <div className='box w-full max-w-400 mx-auto'>
            <ul>
                {data.map(({ user, profile }) => (
                    <li key={user.id}>
                        {user.username}
                    </li>
                ))}
            </ul>
        </div>
    )
};
