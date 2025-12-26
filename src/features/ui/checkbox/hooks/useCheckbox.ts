import { useCallback, useState } from "react";

export const useCheckbox = (
	value?: boolean,
	onToggle?: () => void,
) => {
	// states
	const [isChecked, setIsChecked] = useState<boolean>(false);
    const inputValue = value ?? isChecked;

	const toggle = useCallback(() => {
        
		value === undefined ? setIsChecked((prev) => !prev) : onToggle?.();
	}, [value, onToggle]);

	const keyDown = useCallback(
		(e: React.KeyboardEvent<HTMLButtonElement>) => {
			if (e.code === "Space") {
				e.preventDefault();
				value === undefined ? setIsChecked((prev) => !prev) : onToggle?.();
			}
		},
		[value, onToggle],
	);

	return {
        inputValue,
		isChecked,
		toggle,
		keyDown,
	};
};
