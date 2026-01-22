import { Post } from "@/types/tables/posts";

type Props = {
    data: Post;
    className?: string;
};

export const ToplineCompact = ({ data, className }: Props) => {
    return (
        <ul
            className={`box flex-row! gap-1! px-4! py-0! items-center! w-full h-10! bg-[#00000030]!
                ${data.image_url ? "border-0!" : ""}
                ${className ?? ""}`}
        >
            <li className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2 whitespace-nowrap">
                <div className="w-1 h-1 rounded-full aspect-square bg-blue-1" />
                <span>{data.title}</span>
            </li>
        </ul>
    );
};
