import { Create } from "@/features/posts/components/tabs/Create";
import { Edit } from "@/features/posts/components/tabs/Edit";
import { List } from "@/features/posts/components/tabs/List";
import { View } from "@/features/posts/components/tabs/View";
import { Post, Profile, User } from "@/types/tables/account";
import { useParams } from "next/navigation";

type Props =
    | {
          type: "posts";
          data: { user: User; profile: Profile };
      }
    | {
          type: "post";
          data: Post;
      };

export const Select = ({ type, data }: Props) => {
    const { tab } = useParams<{ tab?: string }>();

    switch (type) {
        case "post": {
            switch (tab) {
                case "create": {
                    return <Create post={data} />;
                }
                case "edit": {
                    return <Edit post={data} />;
                }
                default: {
                    return <View post={data} />;
                }
            }
        }
        case "posts": {
            return <List data={data} />;
        }
    }
};
