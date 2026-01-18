import { NoPosts } from "@/features/posts/components/errors/NoPosts";
import { Profile, User } from "@/types/tables/account"
import { useAppStore } from "@/zustand/store";

type Props = {
    data: { user: User; profile: Profile };
}

export const List = ({ data }: Props) => {
    const postIds = useAppStore(state => state.postIds);

    if(!postIds[data.user.id]?.length) { 
        return <NoPosts/>
    }

    return (
        <ul>
            posts
        </ul>
    )
}