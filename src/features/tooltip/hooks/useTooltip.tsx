import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { TooltipType } from "../types/tooltip";

export type TooltipConfig = {
	isEnabled?: boolean;
};

export const useTooltip = (
	isEnabled?: boolean,
	description?: string,
	title?: string,
	element?: React.ReactNode,
	type?: TooltipType,
) => {
	// states
	const [isHovered, setIsHovered] = useState<boolean>(false);
	const [isToggled, setIsToggled] = useState<boolean>(false);

	// ui states derived from react states
	const isShown = isHovered || isToggled;

	// container ref
	const ghostRef = useRef<HTMLDivElement>(null);
	const tooltipRef = useRef<HTMLDivElement>(null);

	// other refs
	const hasPositioned = useRef<boolean>(false);

	useEffect(() => {
		if (isShown === false) {
			hasPositioned.current = false;
		}
	}, [isShown]);

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

				requestAnimationFrame(() => {
					hasPositioned.current = true;
				});
			}
		};
		handle();

		window.addEventListener("resize", handle);
		return () => window.removeEventListener("resize", handle);
	}, [isShown]);

	// hotkeys to cancel the modal
	useEffect(() => {
		if (isEnabled !== true) return;

		const handle = (e: KeyboardEvent) => {
			switch (e.code) {
				case "Escape":
					type === "modal" ? setIsToggled(false) : setIsHovered(false);
					break;
				case "Enter":
					if (hasPositioned.current === true) setIsToggled(false);
					break;
			}
		};

		window.addEventListener("keydown", handle);
		return () => window.removeEventListener("keydown", handle);
	}, [type, isEnabled]);

	// click outside to cancel the modal
	useEffect(() => {
		if (!(isEnabled === true && type === "modal" && isToggled === true)) return;

		const handle = (e: PointerEvent) => {
			if (
				!tooltipRef.current?.contains(e.target as Node | null) &&
				hasPositioned.current === true
			) {
				setIsToggled(false);
			}
		};

		window.addEventListener("pointerdown", handle);

		return () => {
			window.removeEventListener("pointerdown", handle);
		};
	}, [type, isToggled, isEnabled]);

	// user functions
	const enter = useCallback(() => {
		if (isEnabled === true && type === "tooltip") {
			setIsHovered(true);
		}
	}, [isEnabled, type]);

	const leave = useCallback(() => {
		if (isEnabled === true && type === "tooltip") {
			setIsHovered(false);
		}
	}, [isEnabled, type]);

	const toggle = useCallback(() => {
		if (isEnabled === true && type === "modal") {
			setIsToggled(true);
		}
	}, [isEnabled, type]);

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
		toggle,
		ghostRef,
		tooltipRef,
	};
};
