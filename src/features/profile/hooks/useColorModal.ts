import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/zustand/store";
import { COLORS_GRID_SIZE } from "../components/modals/Colors";
import { generateColorPalette } from "../utils/generateColorPalette";
import { Profile, User } from "@/types/tables/account";

export const useColorModal = (data: { profile: Profile; user: User }) => {
    // zustand state
    const stateColors = useAppStore((state) => state.colors);

    // zustand methods
    const updateUser = useAppStore((state) => state.updateUser);

    // internal states
    const [colors, setColors] = useState<string[]>(
        Array.from(
            { length: COLORS_GRID_SIZE * COLORS_GRID_SIZE },
            () => "#000000"
        )
    );

    // assigning colors to ours
    useEffect(() => {
        if (stateColors[data.user.id]?.length) {
            requestAnimationFrame(() => {
                setColors(() => {
                    const colors = [];
                    for (const { slot, color } of stateColors[data.user.id]) {
                        colors[Number(slot)] = color;
                    }
                    return colors;
                });
            });
        }
    }, [stateColors, data.user]);

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
                () => "#000000"
            )
        );
    }, []);

    const palette = useCallback(() => {
        const palette = generateColorPalette(
            COLORS_GRID_SIZE * COLORS_GRID_SIZE,
            hueRotation
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
            updateUser({
                id: data.user.id,
                data: {
                    color: colors[selectedId],
                    colors: colorsData,
                },
                promiseKey: "colorsUpdate",
            });
        }
    }, [colors, data.user, updateUser, selectedId]);

    const randomSelect = useCallback(() => {
        let rand = Math.floor(
            Math.random() * COLORS_GRID_SIZE * COLORS_GRID_SIZE
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
