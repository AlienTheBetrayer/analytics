import { useCallback, useEffect, useState } from "react";
import { useAppStore } from "@/zustand/store";
import { COLORS_GRID_SIZE } from "../components/modals/Colors";
import { generateColorPalette } from "../utils/generateColorPalette";

export const useColorModal = () => {
	// zustand state
	const status = useAppStore((state) => state.status);
	const zustandColors = useAppStore((state) => state.colors);

	// zustand methods
	const zustandSetColors = useAppStore((state) => state.setColors);

	// internal states
	const [colors, setColors] = useState<string[]>(
		Array.from(
			{ length: COLORS_GRID_SIZE * COLORS_GRID_SIZE },
			(_) => "#000000",
		),
	);

	// assigning colors to ours
	useEffect(() => {
		if (zustandColors) {
			setColors(() => {
				const colors = [];
				for (const [slot, color] of Object.entries(zustandColors)) {
					colors[Number(slot)] = color;
				}
				return colors;
			});
		}
	}, [zustandColors]);

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
				(_) => "#000000",
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
		if (!status) {
			return;
		}

		const colorsData = colors.map((color, slot) => ({
			slot,
			color,
		}));

		zustandSetColors(status.user.id, colorsData);
	}, [colors, zustandSetColors, status]);

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
