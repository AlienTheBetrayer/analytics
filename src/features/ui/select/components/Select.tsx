import { motion } from "motion/react";
import { useEffect, type ComponentPropsWithoutRef } from "react";
import { useInputSelect } from "../hooks/useInputSelect";

type Props = {
    items: string[];
    onChange?: (item: string) => void;
} & Omit<ComponentPropsWithoutRef<"button">, "onChange">;

export const Select = ({ items, value, onChange, ...rest }: Props) => {
    // controller
    const { inputRef, expandToggle, inputValue, keyDown, render } =
        useInputSelect(items, value as string | undefined, onChange);

    useEffect(() => {
        requestAnimationFrame(() => {
            inputRef.current?.focus({ preventScroll: true });
        });
    }, [inputRef]);

    return (
        <button
            ref={inputRef}
            type="button"
            className={`flex w-full items-center min-h-8 
            bg-background-a-3 outline-2 outline-background-5 p-2 rounded-xl focus:outline-blue-1 
             hover:bg-background-a-7 transition-all duration-300 ease-out cursor-pointer`}
            onClick={expandToggle}
            onKeyDown={keyDown}
            {...rest}
        >
            <motion.span
                key={`${inputValue}`}
                initial={{ y: 7.5 }}
                animate={{ y: 0 }}
            >
                {inputValue}
            </motion.span>

            <span className="ml-auto">
                <small>{items.indexOf(inputValue) + 1}</small>
            </span>
            {render()}
        </button>
    );
};
