import { CacheAPIProtocol } from "@/query-api/protocol";
import { exactTime, relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";
import { useMemo } from "react";

type Props<T> = {
    data: T extends {
        created_at: string;
        edited_at?: string;
        last_message?: CacheAPIProtocol["conversations"]["data"][number]["last_message"];
    }
        ? T
        : never;
};

export const Date = <T,>({ data }: Props<T>) => {
    const items = useMemo(() => {
        return [
            ...(data.last_message?.created_at
                ? [
                      {
                          color: "var(--blue-1)",
                          image: "/commentadd.svg",
                          timestamp: data.last_message.created_at,
                      },
                  ]
                : []),
            ...(data.edited_at
                ? [
                      {
                          color: "var(--orange-1)",
                          image: "/pencil.svg",
                          timestamp: data.edited_at,
                      },
                  ]
                : []),
            {
                color: "var(--blue-3)",
                image: "/plus.svg",
                timestamp: data.created_at,
            },
        ];
    }, [data]);

    return (
        <ul className="box acrylic py-2! px-4! rounded-3xl!">
            {items.map((item) => (
                <li key={item.image}>
                    <div className="grid grid-cols-[8rem_auto] gap-1">
                        <span className="flex items-center gap-1 ">
                            <div
                                className="w-1 h-1 rounded-full"
                                style={{
                                    background: item.color,
                                }}
                            />
                            <Image
                                alt=""
                                width={16}
                                height={16}
                                src={item.image}
                            />
                            <span className="truncate">
                                {relativeTime(item.timestamp)}
                            </span>
                        </span>
                        <span className="ml-auto">
                            <small>{exactTime(item.timestamp)}</small>
                        </span>
                    </div>
                </li>
            ))}
        </ul>
    );
};
