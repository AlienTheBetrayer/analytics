import { AnimatePresence } from "motion/react";
import { type ComponentPropsWithoutRef, useState } from "react";
import { Button } from "../../button/components/Button";
import { useInput } from "../hooks/useInput";

type Props = {
	onDelete?: () => void;
} & ComponentPropsWithoutRef<"input">;

export const Input = ({ value, onChange, onDelete, ...rest }: Props) => {
	// value state logic
	const [data, setData] = useState<string>("");
	const inputValue = (value as string | undefined) ?? data;

	// controller
	const controller = useInput();

	return (
		<div className="relative ">
			<input
				type="text"
				className="w-full h-full bg-linear-to-bl 
            from-background-2 to-background-1 outline-2 outline-background-5 p-2 rounded-xl focus:outline-primary-1 hover:brightness-125 transition-all duration-150"
				value={inputValue}
				ref={controller.inputRef}
				onChange={(e) =>
					value === undefined ? setData(e.target.value) : onChange?.(e)
				}
				{...rest}
			/>

			<AnimatePresence>
				{inputValue !== "" && (
					<Button
						className="absolute right-2 top-1/2 -translate-y-1/2 min-w-6! min-h-6! w-6 h-6"
						initial={{ opacity: 0, y: 5 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: 5 }}
						onClick={() => (value === undefined ? setData("") : onDelete?.())}
					>
						✕
					</Button>
				)}
			</AnimatePresence>
		</div>
	);
};
