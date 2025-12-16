import { type HTMLMotionProps, motion } from "motion/react";

type Props = {} & HTMLMotionProps<"button">;

export const Button = ({
	disabled,
	children,
	onClick,
	className,
	...rest
}: Props) => {
	return (
		<motion.button
			onClick={onClick}
			type="button"
			disabled={disabled}
			className={`flex gap-1 items-center justify-center rounded-3xl outline-2 outline-background-5 bg-background-3 min-w-8 min-h-8 px-2
                 hover:brightness-150 active:brightness-200 focus-visible:outline-blue-1 transition duration-150 cursor-pointer
                 ${disabled === true ? 'pointer-events-none opacity-30' : ''} 
                 ${className ?? ""} `}
			{...rest}
		>
			{children}
		</motion.button>
	);
};
