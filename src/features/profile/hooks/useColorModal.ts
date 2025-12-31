import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/zustand/store";
import { COLORS_GRID_SIZE } from "../components/modals/Colors";
import { generateColorPalette } from "../utils/generateColorPalette";
import { Profile } from "@/types/api/database/profiles";
import { User } from "@/types/api/database/user";

export const useColorModal = (data: { profile: Profile; user: User }) => {
    // zustand state
    const zustandColors = useAppStore((state) => state.colors);

    // zustand methods
    const zustandSetColors = useAppStore((state) => state.setColors);
    const setProfileData = useAppStore((state) => state.setProfileData);

    // internal states
    const [colors, setColors] = useState<string[]>(
        Array.from({ length: COLORS_GRID_SIZE * COLORS_GRID_SIZE }, () => "#000000"),
    );

    // assigning colors to ours
    useEffect(() => {
        if (zustandColors?.[data.user.id]) {
            requestAnimationFrame(() => {
                setColors(() => {
                    const colors = [];
                    for (const [slot, color] of Object.entries(zustandColors[data.user.id])) {
                        colors[Number(slot)] = color;
                    }
                    return colors;
                });
            });
        }
    }, [zustandColors, data.user]);

    // states
    const [selectedId, setSelectedId] = useState<number | undefined>();
    const [hueRotation, setHueRotation] = useState<number>(0);

    // user functions
    const set = useCallback((id: number, value: string) => {
        setColors((prev) => prev.map((c, i) => (i === id ? value : c)));
    }, []);

    const clear = useCallback(() => {
        setColors(Array.from({ length: COLORS_GRID_SIZE * COLORS_GRID_SIZE }, () => "#000000"));
    }, []);

    const palette = useCallback(() => {
        const palette = generateColorPalette(COLORS_GRID_SIZE * COLORS_GRID_SIZE, hueRotation);
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

        zustandSetColors(data.user.id, colorsData);

        if (selectedId) {
            setProfileData(data.user.id, { color: colors[selectedId] });
        }
    }, [colors, data.user, zustandSetColors, setProfileData, selectedId]);

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
    };
};
