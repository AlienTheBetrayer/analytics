import { AnimatePresence, motion } from "motion/react";
import type React from "react";
import { useTooltip } from "../hooks/useTooltip";

type TooltipDirection = "top" | "bottom";

type Props = {
	className?: string;
	children?: React.ReactNode;
	description: string;
	title?: string;
	direction?: TooltipDirection;
};

export const Tooltip = ({
	className,
	children,
	description,
	title,
	direction = "bottom",
}: Props) => {
	const controller = useTooltip();

	const directionStyle = () => {
		switch (direction) {
			case "bottom":
				return { top: "115%" };
			case "top":
				return { bottom: "115%" };
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
						className="flex flex-col items-center whitespace-nowrap py-1 px-2 rounded-3xl outline-1 outline-background-5 bg-background-3 z-10 absolute left-1/2 -translate-x-1/2 hover:brightness-150 duration-300"
					>
						<span>
							{title && (
								<h4 className="text-center text-foreground-3!">{title}</h4>
							)}
							<small>{description}</small>
						</span>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
