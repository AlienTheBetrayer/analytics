import { Create } from "@/features/posts/components/tabs/Create";
import { Edit } from "@/features/posts/components/tabs/Edit";
import { List } from "@/features/posts/components/tabs/List";
import { View } from "@/features/posts/components/tabs/View";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { useParams } from "next/navigation";

type Props =
    | {
          type: "posts";
          data?: CacheAPIProtocol["user"]["data"];
      }
    | {
          type: "post";
          data?: CacheAPIProtocol["post"]["data"] | null;
      };

export const Select = ({ type, data }: Props) => {
    const { tab } = useParams<{ tab?: string }>();
    const { data: status } = useQuery({ key: ["status"] });

    switch (type) {
        case "post": {
            if (data && data.user_id !== status?.id && tab !== "view") {
                return <View id={data.id} />;
            }

            switch (tab) {
                case "create": {
                    return <Create />;
                }
                case "edit": {
                    return data && <Edit id={data.id} />;
                }
                default: {
                    return data && <View id={data.id} />;
                }
            }
        }
        case "posts": {
            return data && <List data={data} />;
        }
    }
};
