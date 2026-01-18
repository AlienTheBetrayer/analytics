import {
    TooltipDirection,
    TooltipType,
} from "@/features/tooltip/types/tooltip";
import { positionTooltip } from "@/features/tooltip/utils/positionTooltip";
import { useEffect, useRef, useState } from "react";

export const useTooltip = (options: {
    direction?: TooltipDirection;
    type?: TooltipType;
}) => {
    // mounted fix
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        requestAnimationFrame(() => {
            setMounted(true);
        });
    }, []);

    // states
    const [isShown, setIsShown] = useState<boolean>(false);

    // refs
    const elementRef = useRef<HTMLDivElement | null>(null);
    const tooltipRef = useRef<HTMLDivElement | null>(null);
    const hasPositioned = useRef<boolean>(false);

    useEffect(() => {
        if (isShown) {
            return;
        }

        hasPositioned.current = false;
    }, [isShown]);

    // positioning the tooltip
    useEffect(() => {
        if (!isShown) {
            return;
        }

        const handle = () => {
            if (!elementRef.current || !tooltipRef.current) {
                return;
            }

            requestAnimationFrame(() => {
                positionTooltip(tooltipRef, elementRef, options.direction);
            });

            requestAnimationFrame(() => {
                hasPositioned.current = true;
                tooltipRef.current?.focus({ preventScroll: true });
            });
        };
        handle();

        window.addEventListener("resize", handle);
        return () => window.removeEventListener("resize", handle);
    }, [isShown, options]);

    // hotkeys
    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            switch (e.code) {
                case "Escape":
                    setIsShown(false);
                    break;
            }
        };

        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, []);

    // click away
    useEffect(() => {
        const handle = (e: PointerEvent | FocusEvent) => {
            const target = e.target as HTMLElement;

            if (
                elementRef.current?.contains(target) ||
                tooltipRef.current?.contains(target) ||
                target.closest("[data-tooltip]")
            ) {
                return;
            }

            setIsShown(false);
        };

        window.addEventListener("pointerdown", handle);
        window.addEventListener("focusin", handle);
        return () => {
            window.removeEventListener("pointerdown", handle);
            window.removeEventListener("focusin", handle);
        };
    }, []);

    // focusing
    useEffect(() => {
        if (!isShown || !tooltipRef.current) {
            return;
        }

        const firstFocusable = tooltipRef.current.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );

        requestAnimationFrame(() => {
            if (!(firstFocusable && tooltipRef)) {
                return;
            }

            (firstFocusable ?? tooltipRef.current).focus({
                preventScroll: true,
            });
        });
    }, [isShown]);

    return { mounted, isShown, setIsShown, tooltipRef, elementRef };
};
