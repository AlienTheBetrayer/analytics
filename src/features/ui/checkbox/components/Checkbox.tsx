/** biome-ignore-all lint/a11y/useSemanticElements: <custom cehckbox> */
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import { useCheckbox } from "../hooks/useCheckbox";

type Props = {
	onToggle?: () => void;
	value?: boolean;
} & Omit<Omit<ComponentPropsWithoutRef<"button">, "onChange">, "value">;

export const Checkbox = ({ children, value, onToggle, ...rest }: Props) => {
	// controller
	const controller = useCheckbox(value, onToggle);

	return (
		<button
			type="button"
			role="checkbox"
			aria-checked={controller.inputValue}
			aria-label={typeof children === "string" ? children : undefined}
			onClick={controller.toggle}
			onKeyDown={controller.keyDown}
			className={`checkbox flex w-full gap-2 h-8 px-2 py-1.5 items-center bg-linear-to-bl 
                from-background-2 to-background-1 rounded-xl
             hover:brightness-125 transition-colors duration-300 ease-out cursor-pointer outline-2 outline-transparent focus-within:outline-blue-1!`}
			{...rest}
		>
			<div
				className={`flex items-center justify-center aspect-square h-full rounded-xl outline-2 outline-background-5 duration-300 ease-out
                ${controller.inputValue ? "outline-blue-1" : ""}`}
			>
				<Image
					src="/checkmark.svg"
					width={12}
					height={12}
					alt=""
					className={`${controller.inputValue ? "opacity-100" : "opacity-0"} transition-all duration-1000`}
				/>
			</div>
			<span className="flex gap-1 w-full">{children}</span>
		</button>
	);
};
