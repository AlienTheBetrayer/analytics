import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const useInputSelect = (
    items: string[],
    value: string | undefined,
    onChange?: (item: string) => void
) => {
    // states
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<string>(
        items.length > 0 ? items[0] : ""
    );

    // derived from state
    const inputValue = (value as string | undefined) ?? selectedItem;

    // refs
    const inputRef = useRef<HTMLButtonElement | null>(null);
    const expandRef = useRef<HTMLUListElement | null>(null);

    // position calculating
    // biome-ignore lint/correctness/useExhaustiveDependencies: <recalculate on expand open>
    useEffect(() => {
        const handle = () => {
            if (!(inputRef.current && expandRef.current)) {
                return;
            }

            const inputBounds = inputRef.current.getBoundingClientRect();

            expandRef.current.style.left = `${inputBounds.left}px`;
            expandRef.current.style.width = `${inputBounds.width}px`;
            expandRef.current.style.top = `${inputBounds.top + inputBounds.height + window.scrollY}px`;
        };
        handle();

        window.addEventListener("resize", handle);
        return () => window.removeEventListener("resize", handle);
    }, [isExpanded]);

    // hotkeys
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            switch (e.code) {
                case "Escape":
                    inputRef.current?.blur();
                    setIsExpanded(false);
                    break;
            }
        };

        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, []);

    // click away
    useEffect(() => {
        const handle = (e: PointerEvent | FocusEvent) => {
            const target = e.target as Node;

            if (
                inputRef.current?.contains(target) ||
                expandRef.current?.contains(target)
            ) {
                return;
            }

            setIsExpanded(false);
        };

        window.addEventListener("pointerdown", handle);
        window.addEventListener("focusin", handle);
        return () => {
            window.removeEventListener("pointerdown", handle);
            window.removeEventListener("focusin", handle);
        };
    }, []);

    const render = useCallback(() => {
        return createPortal(
            <AnimatePresence>
                {isExpanded && (
                    <motion.ul
                        data-tooltip
                        className="absolute flex flex-col z-1001 overflow-hidden rounded-xl border-2 border-background-5"
                        ref={expandRef}
                        initial={{ height: "0px" }}
                        animate={{ height: "auto" }}
                        exit={{ height: "0px" }}
                        transition={{
                            type: "spring",
                            stiffness: 200,
                            damping: 30,
                        }}
                    >
                        {items.map((item) => (
                            <li key={item}>
                                <button
                                    type="button"
                                    className={`flex items-center  w-full 
            bg-background-a-2 backdrop-blur-xl p-2 outline-0 focus-visible:bg-background-a-11
             hover:bg-background-a-9 active:bg-background-a-11 active:text-foreground-1! transition-colors duration-300 ease-out cursor-pointer`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (value) {
                                            onChange?.(item);
                                        } else {
                                            setSelectedItem(item);
                                        }
                                        setIsExpanded(false);
                                    }}
                                >
                                    <span className="whitespace-nowrap text-ellipsis">
                                        {item}
                                    </span>

                                    {item === inputValue && (
                                        <Image
                                            src="/checkmark.svg"
                                            width={10}
                                            height={10}
                                            alt="selected"
                                            className="ml-auto"
                                        />
                                    )}
                                </button>
                            </li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>,
            document.body
        );
    }, [items, isExpanded, onChange, value, inputValue]);

    const expandToggle = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const keyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>) => {
            const id = items.indexOf(inputValue);

            switch (e.code) {
                case "ArrowUp": {
                    const item = items[id > 0 ? id - 1 : items.length - 1];

                    if (value) {
                        onChange?.(item);
                    } else {
                        setSelectedItem(item);
                    }
                    break;
                }
                case "ArrowDown": {
                    const item = items[id + 1 < items.length ? id + 1 : 0];

                    if (value) {
                        onChange?.(item);
                    } else {
                        setSelectedItem(item);
                    }
                    break;
                }
            }
        },
        [items, inputValue, value, onChange]
    );

    return {
        inputRef,
        keyDown,
        render,
        expandToggle,
        inputValue,
    };
};
