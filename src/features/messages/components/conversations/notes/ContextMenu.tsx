import { CacheAPIProtocol } from "@/query-api/protocol";
import "../../message/ContextMenu.css";
import Image from "next/image";

type Props = {
    data?: CacheAPIProtocol["conversations"]["data"][number];
}

export const ContextMenu = ({ data }: Props) => {
    return (
        <ul className="box acrylic p-4! rounded-2xl! gap-1! **:border-0! w-screen max-w-64 message-ctx">
            <li className="flex items-center gap-1 mb-6! self-center">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/save.svg"
                />
            </li>
        </ul>
    );
};
