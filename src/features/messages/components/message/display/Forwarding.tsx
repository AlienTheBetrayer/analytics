/** @format */

import { FilterNothing } from "@/features/messages/components/errors/FilterNothing";
import { ForwardingElement } from "@/features/messages/components/message/display/ForwardingElement";
import { useForwarding } from "@/features/messages/components/message/display/useForwarding";
import { Input } from "@/features/ui/input/components/Input";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import Image from "next/image";

export type ForwardingProps = {
    onAction: (conversation: MapType<CacheAPIProtocol["conversations"]["data"]["conversations"]>) => void;
};

export const Forwarding = ({ onAction }: ForwardingProps) => {
    // fetching + filtering
    const { conversationIds, isLoading, filter, setFilter } = useForwarding();

    // fallback
    if (isLoading) {
        return null;
    }

    // jsx
    return (
        <article className="box p-4! gap-4! acrylic items-center w-full">
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

            {conversationIds.length ?
                <ul
                    className="flex flex-col gap-1 w-full overflow-y-auto max-h-64 scheme-dark"
                    style={{
                        scrollbarWidth: "thin",
                    }}
                >
                    {conversationIds.map((id) => (
                        <li key={id}>
                            <ForwardingElement
                                conversationId={id}
                                onAction={onAction}
                            />
                        </li>
                    ))}
                </ul>
            :   <div className="w-full h-full p-4 loading">
                    <FilterNothing
                        onClear={() => {
                            setFilter("");
                        }}
                    />
                </div>
            }
        </article>
    );
};
