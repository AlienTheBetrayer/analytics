import { Create } from "@/features/posts/components/tabs/Create";
import { Edit } from "@/features/posts/components/tabs/Edit";
import { List } from "@/features/posts/components/tabs/List";
import { View } from "@/features/posts/components/tabs/View";
import { Profile, User } from "@/types/tables/account";
import { Post } from "@/types/tables/posts";
import { useParams } from "next/navigation";

type Props =
    | {
          type: "posts";
          data?: { user: User; profile: Profile };
      }
    | {
          type: "post";
          data?: Post;
      };

export const Select = ({ type, data }: Props) => {
    const { tab } = useParams<{ tab?: string }>();

    switch (type) {
        case "post": {
            switch (tab) {
                case "create": {
                    return <Create />;
                }
                case "edit": {
                    return data && <Edit post={data} />;
                }
                default: {
                    return data && <View post={data} />;
                }
            }
        }
        case "posts": {
            return data && <List data={data} />;
        }
    }
};
