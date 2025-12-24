import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export type TooltipConfig = {
	isEnabled?: boolean;
};

export const useTooltip = (
	isEnabled?: boolean,
	description?: string,
	title?: string,
	element?: React.ReactNode,
) => {
	// states
	const [isShown, setIsShown] = useState<boolean>(false);

	// container ref
	const ghostRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	// tooltip positioning
	useEffect(() => {
		const handle = () => {
			if (ghostRef.current && tooltipRef.current && isShown) {
				const ghostBounds = ghostRef.current.getBoundingClientRect();

				// overflow handling
				const dx =
					ghostBounds.left < 0
						? -ghostBounds.left
						: ghostBounds.right > window.innerWidth
							? window.innerWidth - ghostBounds.right
							: 0;

				tooltipRef.current.style.display = "flex";
				tooltipRef.current.style.translate = `${ghostBounds.left + dx}px ${ghostBounds.top}px`;
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
		if (isEnabled === true) {
			setIsShown(true);
		}
	}, [isEnabled]);

	const leave = useCallback(() => {
		if (isEnabled === true) {
			setIsShown(false);
		}
	}, [isEnabled]);

	const render = useCallback(() => {
		return createPortal(
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				exit={{ opacity: 0 }}
				style={{ display: "none" }}
				ref={tooltipRef}
				className="flex items-center py-1 gap-2 px-4 rounded-3xl text-center outline-1 outline-background-5 bg-background-3 z-100 absolute left-0 top-0 hover:brightness-150 duration-300"
			>
				<div className="flex flex-col">
					<span className="max-w-96 w-max break-keep">
						{title && (
							<h4 className="text-center text-foreground-3!">{title}</h4>
						)}
						{description}
					</span>
				</div>

				{element}
			</motion.div>,
			document.body,
		);
	}, [title, description, element]);

	return {
		enter,
		leave,
		render,
		isShown,
		ghostRef,
		tooltipRef,
	};
};
