import { NoResponse } from "@/features/contact/components/errors/NoResponse";
import { ResponseAdmin } from "@/features/contact/components/tabs/view/Admin";
import { ResponseBottomBar } from "@/features/contact/components/tabs/view/ResponseBottomBar";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import Image from "next/image";
import { useState } from "react";

type Props = {
    data: CacheAPIProtocol["contact_message"]["data"] | null;
};

export const Response = ({ data }: Props) => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });

    // tab
    const [tab, setTab] = useState<"view" | "admin">("view");

    // fallbacks
    if (!data) {
        return null;
    }

    return (
        <div className="flex flex-col gap-2 grow min-h-82">
            {tab === "view" ? (
                <ResponseView data={data} />
            ) : (
                <ResponseAdmin data={data} />
            )}

            {status?.role === "admin" ||
                (status?.role === "op" && (
                    <ResponseBottomBar
                        data={data}
                        tab={tab}
                        onSelect={(tab) => setTab(tab)}
                    />
                ))}
        </div>
    );
};

const ResponseView = ({ data }: Props) => {
    if (!data?.response) {
        return (
            <div className="box p-3! h-full grow flex justify-center items-center loading">
                <NoResponse />
            </div>
        );
    }

    return (
        <div className="box p-3! grow">
            <ul className="box h-10! p-0! flex-row! items-center! w-full">
                <li className="absolute left-1/2 top-1/2 -translate-1/2">
                    <span className="flex items-center gap-1">
                        <div className="w-1 h-1 rounded-full bg-blue-1" />
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/send.svg"
                        />
                        Our response:
                    </span>
                </li>
            </ul>

            <span className="box p-2! grow w-full text-center items-center justify-center">
                {data.response}
            </span>
        </div>
    );
};
