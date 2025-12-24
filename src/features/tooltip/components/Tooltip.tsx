/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
import { AnimatePresence } from "motion/react";
import type React from "react";
import { useTooltip } from "../hooks/useTooltip";
import type { TooltipDirection, TooltipType } from "../types/tooltip";
import { getDirectionStyle } from "../utils/getDirectionStyle";

type Props = {
	className?: string;
	children?: React.ReactNode;
	description: string;
	title?: string;
	element?: React.ReactNode;
	isEnabled?: boolean;
	direction?: TooltipDirection;
	type?: TooltipType;
};

export const Tooltip = ({
	className,
	children,
	description,
	element,
	isEnabled = true,
	title,
	type = "tooltip",
	direction = "bottom",
}: Props) => {
	// syncing the portal-sent tooltip's position with the ghost tooltip
	const controller = useTooltip(isEnabled, description, title, element, type);

	// determining the ghost tooltip's position
	const directionStyle = getDirectionStyle(direction);

	return (
		<div
			className={`relative ${className ?? ""}`}
			onPointerEnter={controller.enter}
			onPointerLeave={controller.leave}
			onPointerDown={controller.toggle}
			data-tooltip-root={`tooltip-${title}`}
			onKeyDown={(e) => {
				if (e.code === "Enter") controller.toggle();
			}}
		>
			{children}

			<AnimatePresence>
				{controller.isShown && isEnabled && (
					<>
						{/* ghost */}
						<div
							style={directionStyle}
							ref={controller.ghostRef}
							className="flex absolute items-center py-1 gap-2 px-4 text-center z-100 pointer-events-none opacity-0! appearance-none"
						>
							<div className="flex flex-col">
								<span className="max-w-96 w-max break-keep">
									{title && <h4 className="text-center">{title}</h4>}
									{description}
								</span>
							</div>

							{element}
						</div>

						{/* the actual tooltip */}
						{controller.render()}
					</>
				)}
			</AnimatePresence>
		</div>
	);
};
