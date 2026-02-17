import { Pin } from "@/features/messages/components/noteboard/expanded/Pin";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["noteboards"]["data"][number]["elements"][number];
};

export const Element = ({ data }: Props) => {
    const display = useLocalStore((state) => state.display)?.messages?.noteboard
        ?.view;
    const isCompact = display === "compact";

    return (
        <div
            className={`box flex flex-row! h-8! gap-1! px-2! py-0! bg-bg-2! w-full items-center!
        ${data.checked ? "" : "loading"}`}
        >
            <div
                className={`flex shrink-0 items-center justify-center rounded-md p-[0.1rem] aspect-square w-4 outline-2 transition-all
                ${data.checked ? "outline-blue-1" : "outline-bg-5"}
                ${isCompact ? "mr-1" : "mr-3"}`}
            >
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src={data.checked ? "/checkmark.svg" : "/cross.svg"}
                />
            </div>
            <span className="flex items-center truncate w-full">
                {data.title}
                <Pin data={data}/>
            </span>
        </div>
    );
};
