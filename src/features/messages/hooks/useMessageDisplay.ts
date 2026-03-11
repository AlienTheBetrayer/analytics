/** @format */

import { CacheAPIProtocol } from "@/query-api/protocol";
import { MapType } from "@/types/other/utils";
import { useAppStore } from "@/zustand/store";
import { useCallback, useMemo } from "react";

type Props = {
    message: MapType<CacheAPIProtocol["messages"]["data"]["messages"]> | undefined;
};

export const useMessageDisplay = ({ message }: Props) => {
    const updateDisplayFn = useAppStore((state) => state.updateDisplayFn);

    const invertDisplay = useCallback(
        (direction?: "on" | "off") => {
            if (!message) {
                return;
            }
            
            updateDisplayFn((display) => {
                const selecting = new Set(display.messages.selecting);

                switch (direction) {
                    case "on": {
                        selecting.add(message.id);
                        break;
                    }
                    case "off": {
                        selecting.delete(message.id);
                        break;
                    }
                    default: {
                        if (selecting.has(message.id)) {
                            selecting.delete(message.id);
                        } else {
                            selecting.add(message.id);
                        }
                        break;
                    }
                }

                return { messages: { selecting } };
            });
        },
        [message, updateDisplayFn],
    );

    return useMemo(() => {
        return {
            invertDisplay,
        };
    }, [invertDisplay]);
};
