import { AnimatePresence } from "motion/react";
import { type ComponentPropsWithoutRef, useState } from "react";
import { Button } from "../../button/components/Button";
import { useInput } from "../hooks/useInput";

type Props = {
    onDelete?: () => void;
    onChange?: (value: string) => void;
    isEnabled?: boolean;
} & Omit<ComponentPropsWithoutRef<"input">, "onChange">;

export const Input = ({
    className,
    value,
    onChange,
    onDelete,
    isEnabled = true,
    required,
    minLength,
    maxLength,
    ...rest
}: Props) => {
    // value state logic
    const [data, setData] = useState<string>("");
    const inputValue = (value as string | undefined) ?? data;

    // controller
    const controller = useInput();

    const { inputRef } = controller;

    return (
        <div className="relative ">
            <input
                disabled={!isEnabled}
                type="text"
                required={required}
                className={`w-full h-full min-h-8 bg-linear-to-bl 
            from-background-2 to-background-1 outline-2 outline-background-5 p-2 rounded-xl focus:outline-blue-1 
             hover:brightness-125 transition-all duration-300 ease-out focus-visible:brightness-125
            ${required === true || minLength || maxLength ? "invalid:outline-red-1! valid:outline-blue-1!" : ""} 
                 ${isEnabled !== true ? "pointer-events-none opacity-30" : ""} 
            ${className ?? ""}`}
                value={inputValue}
                ref={inputRef}
                onChange={(e) => {
                    if (!value) {
                        setData(e.target.value);
                    }
                    onChange?.(e.target.value);
                }}
                maxLength={maxLength}
                minLength={minLength}
                {...rest}
            />

            <AnimatePresence>
                {inputValue !== "" && (
                    <Button
                        className="absolute right-2 top-1/2 -translate-y-1/2 min-w-6! min-h-6! w-6 h-6"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        onClick={() => {
                            if (!value) {
                                setData("");
                            }
                            onDelete?.();
                            onChange?.("");
                        }}
                    >
                        ✕
                    </Button>
                )}
            </AnimatePresence>
        </div>
    );
};
