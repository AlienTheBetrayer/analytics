import { motion } from "motion/react";
import { type ComponentPropsWithoutRef } from "react";
import { useInputSelect } from "../hooks/useInputSelect";
import Image from "next/image";

type Props = {
    items: string[];
    onChange?: (item: string) => void;
} & Omit<ComponentPropsWithoutRef<"button">, "onChange">;

export const Select = ({
    items,
    className,
    value,
    onChange,
    ...rest
}: Props) => {
    // controller
    const { inputRef, inputValue, expandToggle, keyDown, render } =
        useInputSelect(items, value as string | undefined, onChange);

    return (
        <button
            ref={inputRef}
            type="button"
            className={`flex w-full items-center min-h-8 
            bg-bg-2 outline-2 outline-bg-3 p-2 rounded-full focus:outline-blue-1 
             hover:bg-bg-3 active:bg-bg-4 transition-all duration-300 ease-out cursor-pointer ${className ?? ""}`}
            onClick={expandToggle}
            onKeyDown={keyDown}
            {...rest}
        >
            <motion.span
                key={`${inputValue}`}
                initial={{ y: 5 }}
                animate={{ y: 0 }}
                className="flex items-center gap-1"
            >
                <Image
                    alt=""
                    width={12}
                    height={12}
                    src="/select.svg"
                />
                {inputValue}
            </motion.span>

            <span className="ml-auto">
                <small>{items.indexOf(inputValue) + 1}</small>
            </span>

            {render()}
        </button>
    );
};
