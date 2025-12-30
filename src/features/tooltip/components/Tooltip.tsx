/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";
import "./Tooltip.css";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { TooltipDirection } from "../types/Tooltip";
import { positionTooltip } from "../utils/positionTooltip";

type Props = {
	title?: string;
	text?: string;
	element?: React.ReactNode;
	direction?: TooltipDirection;
	disabledPointer?: boolean;
	className?: string;
	children: React.ReactNode;
};

export const Tooltip = ({
	title,
	text,
	element,
	direction = "bottom",
	className = "",
	disabledPointer = false,
	children,
}: Props) => {
	// states
	const [isShown, setIsShown] = useState<boolean>(false);

	// refs
	const elementRef = useRef<HTMLDivElement | null>(null);
	const tooltipRef = useRef<HTMLDivElement | null>(null);

	// positioning the tooltip
	useEffect(() => {
		if (!isShown) {
			return;
		}

		const handle = () => {
			if (!elementRef.current || !tooltipRef.current) {
				return;
			}

			positionTooltip(tooltipRef, elementRef, direction);
		};
		handle();

		window.addEventListener("resize", handle);
		return () => window.removeEventListener("resize", handle);
	}, [isShown, direction]);

	return (
		<>
			<div
				ref={elementRef}
				onPointerEnter={() => setIsShown(true)}
				onPointerLeave={() => setIsShown(false)}
				onFocus={() => {
					if (!disabledPointer) {
						setIsShown(true);
					}
				}}
				onBlur={() => {
					if (!disabledPointer) {
						setIsShown(false);
					}
				}}
				onKeyDown={(e) => {
					if (!disabledPointer && e.key === "Escape") {
						setIsShown(false);
					}
				}}
				className={`w-fit h-fit ${className}`}
			>
				{children}
			</div>

			{createPortal(
				<AnimatePresence>
					{isShown && (
						<motion.div
							className="absolute hidden z-9999 p-1"
							ref={tooltipRef}
							initial={{ pointerEvents: !disabledPointer ? "all" : "none" }}
							exit={{ pointerEvents: "none" }}
							onPointerEnter={() => {
								if (!disabledPointer) {
									setIsShown(true);
								}
							}}
							onPointerLeave={() => {
								if (!disabledPointer) {
									setIsShown(false);
								}
							}}
						>
							<motion.div
								className={`${!element ? "tooltip" : ""}
                                whitespace-nowrap border-0 outline-0
                            `}
								initial={{
									opacity: 0,
									pointerEvents: !disabledPointer ? "all" : "none",
								}}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0, pointerEvents: "none" }}
							>
								{element ? (
									element
								) : (
									<div className="flex flex-col items-center">
										{title && (
											<span className="text-background-9!">
												<b>{title}</b>
											</span>
										)}
										{text && <span className="text-background-9!">{text}</span>}
									</div>
								)}
							</motion.div>
						</motion.div>
					)}
				</AnimatePresence>,
				document.body,
			)}
		</>
	);
};
