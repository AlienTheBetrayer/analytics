import { CacheAPIProtocol } from "@/query-api/protocol";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";

type Props = {
    data: CacheAPIProtocol["contact_message"]["data"];
};

export const PreviewDate = ({ data }: Props) => {
    return (
        <ul className="box p-4!">
            <li className="flex items-center gap-1">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/imageadd.svg"
                />
                <span>sent {relativeTime(data.created_at)}</span>
            </li>

            {data.edited_at && (
                <li className="flex items-center gap-1">
                    <Image
                        alt=""
                        width={16}
                        height={16}
                        src="/pencil.svg"
                    />
                    <span>edited {relativeTime(data.edited_at)}</span>
                </li>
            )}
        </ul>
    );
};
