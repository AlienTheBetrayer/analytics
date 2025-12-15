import { type HTMLMotionProps, motion } from "motion/react";

type Props = {} & HTMLMotionProps<"button">;

export const Button = ({ children, onClick, className, ...rest }: Props) => {
	return (
		<motion.button
			onClick={onClick}
			className={`flex gap-1 items-center justify-center rounded-3xl outline-2 outline-background-5 bg-background-3 min-w-8 min-h-8 px-2 hover:brightness-150 active:brightness-200 focus-visible:outline-primary-1 transition duration-150 cursor-pointer ${className ?? ""} `}
			{...rest}
		>
			{children}
		</motion.button>
	);
};
