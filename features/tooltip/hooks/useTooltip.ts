import { useCallback, useEffect, useRef, useState } from "react";

export const useTooltip = () => {
	// states
	const [isShown, setIsShown] = useState<boolean>(false);

	// container ref
	const containerRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

    // tooltip positioning
	useEffect(() => {
		const handle = () => {
			if (containerRef.current && tooltipRef.current && isShown) {
				const containerBounds = containerRef.current.getBoundingClientRect();
				tooltipRef.current.style.display = "flex";
				tooltipRef.current.style.translate = `${containerBounds.left}px ${containerBounds.top}px`;
			}
		};
		handle();

		window.addEventListener("resize", handle);
		return () => window.removeEventListener("resize", handle);
	}, [isShown]);

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
		containerRef,
		tooltipRef,
	};
};
