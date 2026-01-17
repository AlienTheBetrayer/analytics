import { Profile, User } from "@/types/tables/account"

type Props = {
    data: { user: User; profile: Profile };
}

export const List = ({ data }: Props) => {
    return (
        <ul>
            posts
        </ul>
    )
}