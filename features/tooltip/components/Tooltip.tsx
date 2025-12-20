import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";
import { createPortal } from "react-dom";
import { useTooltip } from "../hooks/useTooltip";

export type TooltipDirection =
	| "top"
	| "bottom"
	| "bottom-right"
	| "bottom-left"
	| "inside"
	| "left"
	| "right";

type Props = {
	className?: string;
	children?: React.ReactNode;
	description: string;
	title?: string;
	isEnabled?: boolean;
	element?: React.ReactNode;
	direction?: TooltipDirection;
};

export const Tooltip = ({
	className,
	children,
	description,
	element,
	isEnabled = true,
	title,
	direction = "bottom",
}: Props) => {
	const directionStyle = (): CSSProperties => {
		switch (direction) {
			case "bottom":
				return { left: '50%', top: "115%", transform: "translate(-50%, 0)" };
			case "bottom-right":
                return { left: "0", top: "115%", transform: "translate(0, 0)" };
			case "bottom-left":
				return { right: "0", top: "115%", transform: "translate(0, 0)" };
			case "top":
				return { left:'50%', bottom: "115%", transform: "translate(-50%, 0)" };
			case "inside":
				return { top: "50%", transform: "translate(-50%, -50%)" };
			case "left":
				return {
					left: "-8px",
					top: "50%",
					transform: "translate(-100%, -50%)",
				};
			case "right":
				return { left: "100%", top: "50%", transform: "translate(8px, -50%)" };
		}
	};

	const controller = useTooltip({
		isEnabled,
	});

	return (
		<div
			className={`relative ${className ?? ""}`}
			onPointerEnter={controller.enter}
			onPointerLeave={controller.leave}
		>
			{children}

			<AnimatePresence>
				{controller.isShown && isEnabled && (
					<>
						{/* ghost */}
						<div
							style={directionStyle()}
							ref={controller.containerRef}
							className="flex absolute items-center py-1 gap-2 px-4 text-center z-100 pointer-events-none opacity-0!"
						>
							<div className="flex flex-col">
								<span className="max-w-96 w-max break-keep">
									{title && <h4 className="text-center">{title}</h4>}
									<small>{description}</small>
								</span>
							</div>

							{element}
						</div>

						{/* the actual tooltip */}
						{createPortal(
							<motion.div
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								style={{ display: "none" }}
								ref={controller.tooltipRef}
								className="flex items-center py-1 gap-2 px-4 rounded-3xl text-center outline-1 outline-background-5 bg-background-3 z-100 absolute left-0 top-0 hover:brightness-150 duration-300"
							>
								<div className="flex flex-col">
									<span className="max-w-96 w-max break-keep">
										{title && (
											<h4 className="text-center text-foreground-3!">
												{title}
											</h4>
										)}
										<small>{description}</small>
									</span>
								</div>

								{element}
							</motion.div>,
							document.body,
						)}
					</>
				)}
			</AnimatePresence>
		</div>
	);
};
