import { useCallback, useState } from "react";
import { COLORS_GRID_SIZE } from "../components/modals/Colors";
import { generateColorPalette } from "../utils/generateColorPalette";

export const useColorModal = () => {
	// states
	const [colors, setColors] = useState<string[]>(
		Array.from(
			{ length: COLORS_GRID_SIZE * COLORS_GRID_SIZE },
			(_) => "#000000",
		),
	);
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
		const palette = generateColorPalette(COLORS_GRID_SIZE * COLORS_GRID_SIZE, hueRotation);
		setColors(palette);
	}, [hueRotation]);

    const select = useCallback((id: number) => {
        setSelectedId(id);
    }, []);

	return {
		colors,
		set,
        select,
        selectedId,
        hueRotation,
        setHueRotation,
		clear,
		palette,
	};
};
