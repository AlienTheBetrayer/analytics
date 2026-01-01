import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import type { MenuItem } from "../types/menu";

export const useMenu = (
    items: MenuItem[],
    value?: number,
    type?: string,
    color?: string
) => {
    // states
    const [selectedItem, setSelectedItem] = useState<number>(value ?? 0);

    // refs
    const buttonRefs = useRef<(HTMLButtonElement | HTMLAnchorElement | null)[]>(
        []
    );
    const selectRef = useRef<HTMLDivElement | null>(null);

    // positioning
    useEffect(() => {
        const handle = () => {
            setTimeout(() => {
                if (!(buttonRefs.current[selectedItem] && selectRef.current)) {
                    return;
                }

                const buttonBounds =
                    buttonRefs.current[selectedItem].getBoundingClientRect();

                selectRef.current.style.left = `${buttonBounds.left + window.scrollX}px`;
                selectRef.current.style.top = `${buttonBounds.bottom + window.scrollY}px`;
                selectRef.current.style.display = `flex`;
                selectRef.current.style.width = `${buttonBounds.width}px`;

                if (type === "link") {
                    selectRef.current.style.transform = "scale(0, 1)";
                    if (selectRef.current) {
                        selectRef.current.style.transform = "scale(1, 1)";
                    }
                }
            }, 1);
        };
        handle();

        window.addEventListener("resize", handle);
        return () => window.removeEventListener("resize", handle);
    }, [selectedItem, type]);

    const select = useCallback((idx: number) => {
        setSelectedItem(idx);
    }, []);

    // rendering
    const renderElement = useCallback(() => {
        return items[selectedItem]?.element;
    }, [selectedItem, items]);

    const renderSelect = useCallback(() => {
        return createPortal(
            <div
                className={`absolute hidden transition-all duration-300 ease-out h-px origin-center`}
                style={{ backgroundColor: color ?? "var(--blue-1)" }}
                ref={selectRef}
            />,
            document.body
        );
    }, [color]);

    return {
        selectedItem,
        buttonRefs,
        select,
        renderElement,
        renderSelect,
    };
};
