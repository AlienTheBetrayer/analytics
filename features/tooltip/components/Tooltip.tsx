import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import type { CSSProperties } from "react";
import { useTooltip } from "../hooks/useTooltip";

type TooltipDirection = "top" | "bottom" | "inside";

type Props = {
	className?: string;
	children?: React.ReactNode;
	description: string;
	title?: string;
	element?: React.ReactNode;
	direction?: TooltipDirection;
};

export const Tooltip = ({
	className,
	children,
	description,
	element,
	title,
	direction = "bottom",
}: Props) => {
	const controller = useTooltip();

	const directionStyle = (): CSSProperties => {
		switch (direction) {
			case "bottom":
				return { top: "115%", translate: `-50% 0` };
			case "top":
				return { bottom: "115%", translate: `-50% 0` };
			case "inside":
				return { top: "50%", translate: `-50% -50%` };
		}
	};

	return (
		<div
			className={`relative ${className ?? ""}`}
			onPointerEnter={controller.enter}
			onPointerLeave={controller.leave}
		>
			{children}

			<AnimatePresence>
				{controller.isShown && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						style={directionStyle()}
						className="flex items-center py-1 gap-2 px-4 rounded-3xl text-center outline-1 outline-background-5 bg-background-3 z-10 absolute left-1/2  hover:brightness-150 duration-300"
					>
						<div className="flex flex-col">
							<span className="max-w-96 w-max break-keep">
								{title && (
									<h4 className="text-center text-foreground-3!">{title}</h4>
								)}
								<small>{description}</small>
							</span>
						</div>
                        {element}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
