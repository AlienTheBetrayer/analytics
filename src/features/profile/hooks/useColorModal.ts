import { useCallback, useEffect, useState } from "react";
import { COLORS_GRID_SIZE } from "../components/modals/Colors";
import { generateColorPalette } from "../utils/generateColorPalette";
import { CacheAPIProtocol } from "@/query-api/protocol";
import { useQuery } from "@/query/core";
import { updateUser } from "@/query-api/calls/users";
import { wrapPromise } from "@/promises/core";

export const useColorModal = (data: CacheAPIProtocol["user"]["data"]) => {
    const { data: colorsData } = useQuery({ key: ["colors", data.id] });

    // internal states
    const [colors, setColors] = useState<string[]>(
        Array.from(
            { length: COLORS_GRID_SIZE * COLORS_GRID_SIZE },
            () => "#000000",
        ),
    );

    // assigning colors to ours
    useEffect(() => {
        if (!colorsData?.length) {
            return;
        }

        requestAnimationFrame(() => {
            setColors(() => {
                const colors = [];
                for (const { slot, color } of colorsData) {
                    colors[Number(slot)] = color;
                }
                return colors;
            });
        });
    }, [colorsData]);

    // states
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [hueRotation, setHueRotation] = useState<number>(0);

    // user functions
    const set = useCallback((id: number, value: string) => {
        setColors((prev) => prev.map((c, i) => (i === id ? value : c)));
    }, []);

    const clear = useCallback(() => {
        setColors(
            Array.from(
                { length: COLORS_GRID_SIZE * COLORS_GRID_SIZE },
                () => "#000000",
            ),
        );
    }, []);

    const palette = useCallback(() => {
        const palette = generateColorPalette(
            COLORS_GRID_SIZE * COLORS_GRID_SIZE,
            hueRotation,
        );
        setColors(palette);
    }, [hueRotation]);

    const select = useCallback((id: number) => {
        setSelectedId(id);
    }, []);

    const apply = useCallback(() => {
        // check themes
        const colorsData = colors.map((color, slot) => ({
            slot,
            color,
        }));

        if (selectedId) {
            wrapPromise("colorsUpdate", () => {
                return updateUser({
                    id: data.id,
                    username: data.username,
                    data: {
                        color: colors[selectedId],
                        colors: colorsData,
                    },
                });
            });
        }
    }, [colors, data, selectedId]);

    const randomSelect = useCallback(() => {
        let rand = Math.floor(
            Math.random() * COLORS_GRID_SIZE * COLORS_GRID_SIZE,
        );

        if (rand < 0) {
            rand = 0;
        }

        if (rand >= COLORS_GRID_SIZE * COLORS_GRID_SIZE) {
            rand = COLORS_GRID_SIZE * COLORS_GRID_SIZE - 1;
        }

        setSelectedId(rand);
    }, []);

    return {
        colors,
        set,
        select,
        selectedId,
        hueRotation,
        setHueRotation,
        clear,
        apply,
        palette,
        randomSelect,
    };
};
