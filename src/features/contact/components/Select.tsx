import { Edit } from "@/features/contact/components/tabs/edit/Edit";
import { List } from "@/features/contact/components/tabs/list/List";
import { Send } from "@/features/contact/components/tabs/send/Send";
import { View } from "@/features/contact/components/tabs/view/View";
import { useParams } from "next/navigation";

export const Select = () => {
    const { tab } = useParams<{ tab?: string; id?: string }>();

    switch (tab) {
        case "view": {
            return <View />;
        }
        case "send": {
            return <Send />;
        }
        case "edit": {
            return <Edit />;
        }
        case "list":
        default: {
            return <List />;
        }
    }
};
