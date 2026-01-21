import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Post } from "@/types/tables/posts";
import { useAppStore } from "@/zustand/store";

type Props = {
    data: Post;
};

export const Topline = ({ data }: Props) => {
    // zustand
    const profiles = useAppStore((state) => state.profiles);

    return (
        <ul className={`box w-full h-10! p-0! bg-[#00000030]! rounded-none! ${data.image_url ? "border-0!" : ""}`}>
            <li className="absolute left-3 top-1/2 -translate-y-1/2">
                <ProfileImage
                    profile={profiles[data.user_id]}
                    className="w-6"
                />
            </li>

            <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2">
                <div className="w-1 h-1 rounded-full aspect-square bg-blue-1" />
                <span>{data.title}</span>
            </li>

            <li></li>

            <li></li>
        </ul>
    );
};
