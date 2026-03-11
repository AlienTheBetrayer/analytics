/** @format */

import { useMutedStopwatch } from "@/features/messages/hooks/useMutedStopwatch";
import Image from "next/image";

type Props = {
    stopwatch: ReturnType<typeof useMutedStopwatch>;
};

export const MutedStatus = ({ stopwatch }: Props) => {
    if (!stopwatch.isMuted) {
        return null;
    }

    return (
        <div className="flex items-center gap-1 absolute left-1/2 top-1/2 -translate-1/2 truncate shrink-0">
            <Image
                alt=""
                width={16}
                height={16}
                src="/auth.svg"
            />
            <span>Muted</span>
            <span>
                <small>(unmuted {stopwatch.relativeTime})</small>
            </span>
        </div>
    );
};
