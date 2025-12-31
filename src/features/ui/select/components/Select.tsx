import { motion } from "motion/react";
import type { ComponentPropsWithoutRef } from "react";
import { useInputSelect } from "../hooks/useInputSelect";

type Props = {
    items: string[];
    onChange?: (item: string) => void;
} & Omit<ComponentPropsWithoutRef<"button">, "onChange">;

export const Select = ({ items, value, onChange, ...rest }: Props) => {
    // controller
    const controller = useInputSelect(items, value as string | undefined, onChange);

    const { inputRef, expandToggle, inputValue, keyDown, render } = controller;

    return (
        <>
            <button
                ref={inputRef}
                type="button"
                className={`flex w-full items-center min-h-8 bg-linear-to-bl 
            from-background-2 to-background-1 outline-2 outline-background-5 p-2 rounded-xl focus:outline-blue-1 
             hover:brightness-125 transition-colors duration-300 ease-out cursor-pointer`}
                onClick={expandToggle}
                onKeyDown={keyDown}
                {...rest}
            >
                <motion.span key={`${inputValue}`} initial={{ y: 7.5 }} animate={{ y: 0 }}>
                    {inputValue}
                </motion.span>

                <span className="ml-auto">
                    <small>{items.indexOf(inputValue) + 1}</small>
                </span>
            </button>
            {render()}
        </>
    );
};
