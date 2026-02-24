import { BottomButtons } from "@/features/messages/components/conversations/display/parts/BottomButtons";
import { LastMessage } from "@/features/messages/components/conversations/display/parts/LastMessage";
import { LastMessageDate } from "@/features/messages/components/conversations/display/parts/LastMessageDate";
import { Pinned } from "@/features/messages/components/conversations/display/parts/Pinned";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { CacheAPIProtocol } from "@/query-api/protocol";
import Image from "next/image";
import { useParams } from "next/navigation";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
};

export const NotesDisplay = ({ data }: Props) => {
    const { tab, id } = useParams<{ tab?: string; id?: string }>();
    const isSelected = tab === "notes" || id === data?.id;

    return (
        <div className="relative">
            <LinkButton
                className={`box p-4! flex-row! h-20! rounded-4xl! justify-start! items-start! gap-4!
                ${isSelected ? "not-hover:bg-bg-4! hover:border-bg-5!" : "not-hover:bg-bg-1!"}`}
                href={
                    isSelected
                        ? "/messages/"
                        : data
                          ? `/messages/c/${data.id}`
                          : "/messages/notes/"
                }
            >
                <div
                    className="relative rounded-full overflow-hidden w-12 h-12 flex items-center justify-center bg-bg-3 shrink-0 
                    bg-linear-to-tr from-[#5161d5] to-[#101857]"
                >
                    {data?.image_url ? (
                        <Image
                            alt=""
                            fill
                            style={{ objectFit: "cover" }}
                            src={data.image_url}
                            className="invert-0!"
                        />
                    ) : (
                        <Image
                            alt="notes"
                            src="/save.svg"
                            width={24}
                            height={24}
                            className="w-6! h-6! invert-90!"
                        />
                    )}
                </div>

                <div className="flex flex-col gap-1 w-full overflow-hidden">
                    <div className="grid grid-cols-[auto_25%]">
                        <span>{data?.title || "Notes"}</span>
                        <LastMessageDate data={data} />
                    </div>

                    <LastMessage data={data} />
                </div>

                <Pinned data={data} />
            </LinkButton>

            <BottomButtons
                data={data}
                type="notes"
            />
        </div>
    );
};
