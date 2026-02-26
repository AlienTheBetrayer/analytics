import { CacheAPIProtocol } from "@/query-api/protocol";
import { useAppStore } from "@/zustand/store";
import { useCallback, useMemo } from "react";

type Props = {
    data: CacheAPIProtocol["messages"]["data"][number];
};

export const useMessageDisplay = ({ data }: Props) => {
    const display = useAppStore((state) => state.display.messages);
    const updateDisplay = useAppStore((state) => state.updateDisplay);

    const invertDisplay = useCallback(
        (direction?: "on" | "off") => {
            updateDisplay({
                messages: {
                    selecting: (() => {
                        const map = new Map(display.selecting);

                        switch (direction) {
                            case "on": {
                                map.set(data.id, data);
                                break;
                            }
                            case "off": {
                                map.delete(data.id);
                                break;
                            }
                            default: {
                                if (map.has(data.id)) {
                                    map.delete(data.id);
                                } else {
                                    map.set(data.id, data);
                                }
                                break;
                            }
                        }

                        return map;
                    })(),
                },
            });
        },
        [data, display.selecting, updateDisplay],
    );

    return useMemo(() => {
        return {
            invertDisplay,
        };
    }, [invertDisplay]);
};
