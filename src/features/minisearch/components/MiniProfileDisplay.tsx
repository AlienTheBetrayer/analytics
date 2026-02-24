import { MiniSearchData } from "@/features/minisearch/types/data";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Checkbox } from "@/features/ui/checkbox/components/Checkbox";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: MiniSearchData[number];
} & (
    | { view: "list" }
    | {
          view: "select";
          value: boolean;
          onSelect: (flag: boolean) => void;
      }
);

export const MiniProfileDisplay = ({ data, ...props }: Props) => {
    return (
        <div className="flex items-center gap-1">
            {props.view === "select" && (
                <Checkbox
                    value={props.value}
                    onToggle={(flag) => props.onSelect(flag)}
                    className="w-fit!"
                />
            )}
            <LinkButton
                className="grid! grid-cols-[auto_5rem_1fr] rounded-4xl! px-4! py-2! w-full whitespace-nowrap"
                href={`/profile/${data.username}`}
            >
                <ProfileImage
                    profile={data.profile}
                    width={256}
                    height={256}
                    className="w-6! h-6!"
                />
                <span className="truncate">{data.username}</span>
                <span className="ml-auto! flex items-center gap-1 shrink-0">
                    <small>
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/calendar.svg"
                        />
                    </small>
                    <small>{relativeTime(data.last_seen_at)}</small>
                </span>
            </LinkButton>
        </div>
    );
};
