import { type HTMLMotionProps, motion } from "motion/react";

type Props = {
	isEnabled?: boolean;
	styles?: string;
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
			className={`group
                ${styles} 
                ${isEnabled !== true ? "pointer-events-none opacity-30" : ""}
                ${className ?? ""} `}
			{...rest}
		>
			{children}
		</motion.button>
	);
};
