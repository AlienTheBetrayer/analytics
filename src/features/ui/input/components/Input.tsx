import { AnimatePresence } from "motion/react";
import { type ComponentPropsWithoutRef, useRef, useState } from "react";
import { Button } from "../../button/components/Button";
import { useInput } from "../hooks/useInput";
import Image from "next/image";

type Props = {
    onDelete?: () => void;
    onChange?: (value: string) => void;
    isEnabled?: boolean;
    container?: ComponentPropsWithoutRef<"div">;
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
    container,
    ...rest
}: Props) => {
    // value state logic
    const [data, setData] = useState<string>("");
    const inputValue = (value as string | undefined) ?? data;

    const { inputRef } = useInput();
    const containerRef = useRef<HTMLDivElement | null>(null);

    return (
        <div
            ref={containerRef}
            className={`relative w-full flex items-center justify-center duration-300
                    ${!isEnabled ? "pointer-events-none opacity-30" : ""} `}
            inert={!isEnabled}
            {...container}
        >
            <input
                type="text"
                required={required && isEnabled}
                className={`placeholder:text-background-9 w-full h-full min-h-8 
                    outline-1 outline-background-a-10 p-2.5 rounded-full focus:outline-blue-1 bg-background-a-3
                    hover:bg-background-a-6 transition-all duration-500 focus-visible:bg-background-a-6
                    ${isEnabled && (required || minLength || maxLength) ? "invalid:outline-red-1! valid:outline-blue-1!" : ""} 
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
                        className={`absolute right-2 top-1/2 -translate-y-1/2 min-w-6! min-h-6! w-6 h-6 p-0!
                            `}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        onClick={() => {
                            inputRef.current?.focus();
                            if (!value) {
                                setData("");
                            }
                            onDelete?.();
                            onChange?.("");
                        }}
                    >
                        <Image
                            alt=""
                            width={14}
                            height={14}
                            src="/delete.svg"
                        />
                    </Button>
                )}
            </AnimatePresence>
        </div>
    );
};
