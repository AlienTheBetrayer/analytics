import { useCallback, useEffect, useState } from "react";

export const useTooltip = () => {
    // states
	const [isShown, setIsShown] = useState<boolean>(false);

    // hotkeys
	useEffect(() => {
		const handle = (e: KeyboardEvent) => {
			switch (e.code) {
				case "Escape":
					setIsShown(false);
					break;
			}
		};

		window.addEventListener("keydown", handle);
		return () => window.removeEventListener("keydown", handle);
	}, []);

    // user functions
	const enter = useCallback(() => {
		setIsShown(true);
	}, []);

	const leave = useCallback(() => {
		setIsShown(false);
	}, []);

	return {
		enter,
		leave,
		isShown,
	};
};
