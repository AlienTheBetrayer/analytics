import { type HTMLMotionProps, motion } from "motion/react";
import { ButtonStyles } from "../utils/styles";

type Props = {
	isEnabled?: boolean;
	styles?: keyof typeof ButtonStyles;
} & HTMLMotionProps<"button">;

export const Button = ({
	children,
	onClick,
	isEnabled = true,
	className,
	styles = "button",
	...rest
}: Props) => {
	return (
		<motion.button
			onClick={onClick}
			type="button"
			disabled={!isEnabled}
			className={`flex flex-row! gap-1 items-center justify-center cursor-pointer border-2 group min-w-8 min-h-8 px-2.5 
                ${ButtonStyles[styles]} 
                ${isEnabled !== true ? "pointer-events-none opacity-30" : ""}
                ${className ?? ""} `}
			{...rest}
		>
			{children}
		</motion.button>
	);
};
