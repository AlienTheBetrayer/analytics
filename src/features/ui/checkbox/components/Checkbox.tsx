/** biome-ignore-all lint/a11y/useSemanticElements: <custom cehckbox> */
import Image from "next/image";
import type { ComponentPropsWithoutRef } from "react";
import { useCheckbox } from "../hooks/useCheckbox";

type Props = {
    onToggle?: (flag: boolean) => void;
    value?: boolean;
} & Omit<Omit<ComponentPropsWithoutRef<"button">, "onToggle">, "value">;

export const Checkbox = ({
    children,
    value,
    onToggle,
    className,
    ...rest
}: Props) => {
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
            className={`button flex justify-center! w-full gap-2! h-8 focus-within:outline-blue-1! ${className ?? ""}`}
            {...rest}
        >
            <div
                className={`flex items-center justify-center aspect-square h-full rounded-xl outline-2 outline-bg-3 duration-300 ease-out
                ${controller.inputValue ? "outline-blue-1" : ""}`}
            >
                <Image
                    src="/checkmark.svg"
                    width={15}
                    height={15}
                    alt=""
                    className={`${controller.inputValue ? "opacity-100 scale-100" : "opacity-0 scale-10"} transition-all! duration-300! ease-in-out`}
                />
            </div>
            {children && <span className="flex gap-1 w-full">{children}</span>}
        </button>
    );
};
