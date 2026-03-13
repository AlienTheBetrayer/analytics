import "./Input.css";
import { AnimatePresence } from "motion/react";
import {
    type ComponentPropsWithoutRef,
    forwardRef,
    useRef,
    useState,
} from "react";
import { Button } from "../../button/components/Button";
import Image from "next/image";

type Props = {
    onDelete?: () => void;
    onChange?: (value: string) => void;
    isEnabled?: boolean;
    container?: ComponentPropsWithoutRef<"div">;
    as?: "input" | "textarea";
    autocomplete?: string[];
} & (
    | Omit<ComponentPropsWithoutRef<"input">, "onChange">
    | Omit<ComponentPropsWithoutRef<"textarea">, "onChange">
);

export const Input = forwardRef<HTMLInputElement, Props>(
    function InputComponent(
        {
            className,
            value,
            onChange,
            onDelete,
            autocomplete,
            isEnabled = true,
            required,
            minLength,
            maxLength,
            container,
            children,
            as = "input",
            ...rest
        }: Props,
        ref,
    ) {
        // value state logic
        const [data, setData] = useState<string>("");
        const inputValue = (value as string | undefined) ?? data;

        // refs
        const containerRef = useRef<HTMLDivElement | null>(null);

        const Element = as === "input" ? "input" : "textarea";

        return (
            <div
                ref={containerRef}
                className={`relative w-full flex items-center justify-center duration-300
                    ${!isEnabled ? "pointer-events-none opacity-30" : ""} `}
                inert={!isEnabled}
                {...container}
            >
                <Element
                    ref={ref}
                    {...(as === "input" && { type: "text" })}
                    required={required && isEnabled}
                    className={`input w-full h-full min-h-8 
                    outline-0!
                    bg-bg-2 border border-bg-3 p-2.5 rounded-full focus:border-blue-1! placeholder-bg-5!
                    hover:border-bg-5 transition-colors duration-500  resize-y
                    ${isEnabled && (required || minLength || maxLength) ? "invalid:underline decoration-wavy decoration-red-1 placeholder-shown:no-underline! valid:border-blue-1!" : ""} 
                    ${className ?? ""}`}
                    value={inputValue}
                    onChange={(e) => {
                        if (!value) {
                            setData(e.target.value);
                        }
                        onChange?.(e.target.value);
                    }}
                    maxLength={maxLength}
                    minLength={minLength}
                    list="autocomplete"
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    {...(rest as any)}
                />

                {children}

                {autocomplete && (
                    <datalist id="autocomplete">
                        {autocomplete.map((item) => (
                            <option
                                value={item}
                                key={item}
                            />
                        ))}
                    </datalist>
                )}

                <AnimatePresence>
                    {inputValue !== "" && (
                        <Button
                            className={`absolute! rounded-lg! right-2 top-1/2 min-w-6! min-h-6! w-6! h-6! flex! items-center! justify-center! p-0!
                            `}
                            initial={{ opacity: 0, y: 1 }}
                            animate={{ opacity: 1, y: `-50%` }}
                            exit={{
                                opacity: 0,
                                y: 1,
                                transition: { duration: 0.2 },
                            }}
                            transition={{ duration: 0.5 }}
                            onClick={() => {
                                if (!value) {
                                    setData("");
                                }
                                onDelete?.();
                                onChange?.("");
                            }}
                        >
                            <Image
                                alt=""
                                width={15}
                                height={15}
                                src="/delete.svg"
                            />
                        </Button>
                    )}
                </AnimatePresence>
            </div>
        );
    },
);
