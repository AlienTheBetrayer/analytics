import { Avatar } from "@/features/messages/components/conversations/display/parts/Avatar";
import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { relativeTime } from "@/utils/other/relativeTime";
import Image from "next/image";
import { useMemo, useState } from "react";

type Props = {
    onAction: (
        conversation: CacheAPIProtocol["conversations"]["data"][number],
    ) => void;
};

export const Forwarding = ({ onAction }: Props) => {
    const { data: status } = useQuery({ key: ["status"] });
    const { data, isLoading } = useQuery({
        key: ["conversations", status?.id],
    });

    // filtering
    const [filter, setFilter] = useState<string>("");
    const filtered = useMemo(() => {
        if (!data) {
            return [];
        }

        return (
            !filter.trim()
                ? data
                : [
                      ...data.filter((c) =>
                          c.title
                              ?.trim()
                              .toLowerCase()
                              .includes(filter.trim().toLowerCase()),
                      ),
                  ]
        ).sort((a, b) => {
            const timeA = a.last_message?.created_at || a.created_at;
            const timeB = b.last_message?.created_at || b.created_at;

            return timeB.localeCompare(timeA);
        });
    }, [filter, data]);

    if (isLoading || !data) {
        return null;
    }

    return (
        <article className="box p-4! gap-4! acrylic items-center w-screen max-w-96">
            <span className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-blue-1" />
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/back.svg"
                />
                <span>Forward to...</span>
            </span>

            <Input
                placeholder="Filter..."
                value={filter}
                onChange={(value) => setFilter(value)}
            />

            {filtered.length ? (
                <ul
                    className="flex flex-col gap-1 w-full overflow-y-auto max-h-64 scheme-dark"
                    style={{
                        scrollbarWidth: "thin",
                    }}
                >
                    {filtered.map((c) => (
                        <li key={c.id}>
                            <Button
                                className="w-full justify-start! text-left grid! grid-cols-[3rem_2fr_auto] p-2!"
                                onClick={() => {
                                    onAction(c);
                                }}
                            >
                                <Avatar
                                    data={c}
                                    className="w-8! h-8!"
                                />
                                <span className="truncate">
                                    {c.title ? (
                                        c.title
                                    ) : (
                                        <small>No title</small>
                                    )}
                                </span>

                                {c.last_message ? (
                                    <small className="flex items-center gap-1">
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/pencil.svg"
                                        />
                                        <span>
                                            {relativeTime(
                                                c.last_message.created_at,
                                            )}
                                        </span>
                                    </small>
                                ) : (
                                    <small className="flex items-center gap-1">
                                        <Image
                                            alt=""
                                            width={16}
                                            height={16}
                                            src="/plus.svg"
                                        />
                                        <span>
                                            {relativeTime(c.created_at)}
                                        </span>
                                    </small>
                                )}
                            </Button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-4! loading">
                    <FilterNothing
                        onClear={() => {
                            setFilter("");
                        }}
                    />
                </div>
            )}
        </article>
    );
};
