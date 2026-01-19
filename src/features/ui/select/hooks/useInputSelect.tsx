import { useDisabledScroll } from "@/hooks/useDisabledScroll";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const useInputSelect = (
    items: string[],
    value: string | undefined,
    onChange?: (item: string) => void,
) => {
    // states
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [selectedItem, setSelectedItem] = useState<string>(
        items.length > 0 ? items[0] : "",
    );

    const { setIsDisabled } = useDisabledScroll();

    // derived from state
    const inputValue = (value as string | undefined) ?? selectedItem;

    // refs
    const inputRef = useRef<HTMLButtonElement | null>(null);
    const dialogRef = useRef<HTMLDialogElement | null>(null);

    useEffect(() => {
        if (!dialogRef.current) {
            return;
        }

        if (isExpanded) {
            dialogRef.current.showModal();
            setIsDisabled(true);
        } else {
            dialogRef.current.close();
            setIsDisabled(false);
        }
    }, [isExpanded, setIsDisabled]);

    // position calculating
    useEffect(() => {
        if (!isExpanded) {
            return;
        }

        const handle = () => {
            if (!(inputRef.current && dialogRef.current)) {
                return;
            }

            const inputBounds = inputRef.current.getBoundingClientRect();

            dialogRef.current.style.left = `${inputBounds.left}px`;
            dialogRef.current.style.width = `${inputBounds.width}px`;
            dialogRef.current.style.top = `${inputBounds.top + inputBounds.height}px`;
        };
        handle();

        window.addEventListener("resize", handle);
        return () => window.removeEventListener("resize", handle);
    }, [isExpanded, setIsDisabled]);

    // click away
    useEffect(() => {
        if (!isExpanded) {
            return;
        }

        const handle = (e: PointerEvent) => {
            if (!dialogRef.current) {
                return;
            }

            const { x, y } = { x: e.clientX, y: e.clientY };

            const bounds = dialogRef.current.getBoundingClientRect();

            if (
                x > bounds.left &&
                x < bounds.right &&
                y > bounds.top &&
                y < bounds.bottom
            ) {
                return;
            }

            setIsExpanded(false);
        };

        window.addEventListener("pointerdown", handle);

        return () => {
            window.removeEventListener("pointerdown", handle);
        };
    }, [isExpanded]);

    const render = useCallback(() => {
        return createPortal(
            <AnimatePresence>
                {isExpanded && (
                    <motion.dialog
                        ref={dialogRef}
                        onCancel={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                            setIsExpanded(false);
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-transparent overflow-hidden whitespace-nowrap"
                    >
                        <motion.ul
                            initial={{ height: "0px" }}
                            animate={{ height: "auto" }}
                            exit={{ height: "0px" }}
                            transition={{
                                type: "spring",
                                stiffness: 200,
                                damping: 30,
                            }}
                            data-tooltip
                            className="flex flex-col overflow-hidden rounded-xl border-2 border-background-5"
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
                                            <div className="ml-auto aspect-square rounded-full outline-2 p-1 outline-blue-1">
                                                <Image
                                                    src="/checkmark.svg"
                                                    width={10}
                                                    height={10}
                                                    alt="selected"
                                                />
                                            </div>
                                        )}
                                    </button>
                                </li>
                            ))}
                        </motion.ul>
                    </motion.dialog>
                )}
            </AnimatePresence>,
            document.body,
        );
    }, [items, isExpanded, onChange, value, inputValue]);

    const expandToggle = useCallback(() => {
        setIsExpanded((prev) => !prev);
    }, []);

    const keyDown = useCallback(
        (e: React.KeyboardEvent<HTMLButtonElement>) => {
            if (isExpanded) {
                return;
            }

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
        [items, isExpanded, inputValue, value, onChange],
    );

    return {
        inputRef,
        keyDown,
        render,
        expandToggle,
        inputValue,
    };
};
