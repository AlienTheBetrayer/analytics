import { hslToHex } from "./hslToHex";

/**
 * generates a random color palette
 * @param count how many colors in a palette
 * @returns a color palette
 */
export const generateColorPalette = (count: number = 9, hueRotation: number = 0): string[] => {
	const hue = Math.floor(Math.random() * 360);
	const saturation = Math.floor(Math.random() * 40 + 30);
	const lightness = Math.floor(Math.random() * 30 + 30);

	const palette = [];

	for (let i = 0; i < count; i++) {
		const newHue = (hue + i * hueRotation) % 360;
		const newSat = Math.min(
			100,
			Math.max(0, saturation + (Math.random() - 0.5) * 20),
		);
		const newLight = Math.min(
			100,
			Math.max(0, lightness + (Math.random() - 0.5) * 20),
		);
		palette.push(hslToHex(newHue, newSat, newLight));
	}

	return palette;
};
