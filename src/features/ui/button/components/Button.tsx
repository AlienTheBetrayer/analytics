import { type HTMLMotionProps, motion } from "motion/react";

export const ButtonClassName = `flex gap-1 items-center justify-center rounded-3xl border-2 border-background-5 bg-background-3 min-w-8 min-h-8 px-2.5
                 hover:brightness-150 active:brightness-200 focus-visible:border-blue-1 outline-0 transition duration-150 cursor-pointer`;

type Props = {
	isEnabled?: boolean;
} & HTMLMotionProps<"button">;

export const Button = ({
	children,
	onClick,
	isEnabled = true,
	className,
	...rest
}: Props) => {
	return (
		<motion.button
			onClick={onClick}
			type="button"
			disabled={!isEnabled}
			className={`${ButtonClassName} ${isEnabled !== true ? "pointer-events-none opacity-30" : ""} ${className ?? ""} `}
			{...rest}
		>
			{children}
		</motion.button>
	);
};
