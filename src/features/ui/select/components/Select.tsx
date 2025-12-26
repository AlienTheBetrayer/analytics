import { motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import { useInputSelect } from "../hooks/useInputSelect";

type Props = {
	items: string[];
	onChange?: (item: string) => void;
} & Omit<ComponentPropsWithoutRef<"button">, "onChange">;

export const Select = ({ items, value, onChange, ...rest }: Props) => {
	// controller
	const controller = useInputSelect(
		items,
		value as string | undefined,
		onChange,
	);

	return (
		<>
			<button
				ref={controller.inputRef}
				type="button"
				className={`flex w-full items-center min-h-8 bg-linear-to-bl 
            from-background-2 to-background-1 outline-2 outline-background-5 p-2 rounded-xl focus:outline-blue-1 
             hover:brightness-125 transition-colors duration-150 cursor-pointer`}
				onClick={controller.expandToggle}
				onKeyDown={controller.keyDown}
				{...rest}
			>
				<motion.span
					key={`${controller.inputValue}`}
					initial={{ y: 7.5 }}
					animate={{ y: 0 }}
				>
					{controller.inputValue}
				</motion.span>

				<span className="ml-auto">
					<small>{items.indexOf(controller.inputValue) + 1}</small>
				</span>
			</button>
			{controller.render()}
		</>
	);
};
