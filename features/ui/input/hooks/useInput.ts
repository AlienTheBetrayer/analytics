import { useEffect, useRef } from "react";

export const useInput = () => {
	// states

	// refs
	const inputRef = useRef<HTMLInputElement | null>(null);

    // hotkeys
	useEffect(() => {
		const handle = (e: KeyboardEvent) => {
			switch (e.code) {
				case "Escape":
					if (inputRef.current && inputRef.current === document.activeElement) {
						inputRef.current.blur();
					}
					break;
			}
		};

		window.addEventListener("keydown", handle);
		return () => window.removeEventListener("keydown", handle);
	}, []);

	return {
		inputRef,
	};
};
