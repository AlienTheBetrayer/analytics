import type { PopoverDirection } from "../types/popover";

/**
 * positions a tooltip with all directions
 * @param tooltipRef the ref of the tooltip that will get positioned
 * @param elementRef the hovered element
 */
export const positionPopover = (
    tooltipRef: React.RefObject<HTMLDialogElement | HTMLDivElement | null>,
    elementRef: React.RefObject<HTMLDivElement | null>,
    direction: PopoverDirection = "bottom",
) => {
    // safety flag
    if (!tooltipRef.current || !elementRef.current) {
        return;
    }

    tooltipRef.current.style.display = "flex";

    // getting the bounds of the element
    const elementBounds = elementRef.current.getBoundingClientRect();

    // calculating and setting the direction
    let left = 0;
    let top = 0;
    let translateX = 0;
    let translateY = 0;

    switch (direction) {
        case "bottom": {
            left = elementBounds.left + elementBounds.width / 2;
            top = elementBounds.bottom;
            translateX = -50;
            break;
        }
        case "top": {
            left = elementBounds.left + elementBounds.width / 2;
            top = elementBounds.top;
            translateX = -50;
            translateY = -100;
            break;
        }
        case "left": {
            left = elementBounds.left;
            top = elementBounds.top + elementBounds.height / 2;
            translateY = -50;
            translateX = -100;
            break;
        }
        case "right": {
            left = elementBounds.right;
            top = elementBounds.top + elementBounds.height / 2;
            translateY = -50;
            break;
        }
        case "bottom-right": {
            left = elementBounds.right;
            top = elementBounds.bottom + 4;
            translateX = -100;
            break;
        }
        case "bottom-left": {
            left = elementBounds.left;
            top = elementBounds.bottom + 4;
            break;
        }
        case "top-right": {
            left = elementBounds.right;
            top = elementBounds.top - 4;
            translateX = -100;
            translateY = -100;
            break;
        }
        case "top-left": {
            left = elementBounds.left;
            top = elementBounds.top - 4;
            translateY = -100;
            break;
        }
    }

    // setting the initial positions
    tooltipRef.current.style.left = `${left}px`;
    tooltipRef.current.style.top = `${top}px`;
    tooltipRef.current.style.translate = `${translateX}% ${translateY}%`;

    // // window boundary overflow check
    requestAnimationFrame(() => {
        if (!tooltipRef.current) {
            return;
        }

        const tooltipBounds = tooltipRef.current.getBoundingClientRect();
        let dx = 0;
        let dy = 0;

        if (tooltipBounds.left < 0) {
            dx = -tooltipBounds.left + 4;
        } else if (tooltipBounds.right > document.documentElement.clientWidth) {
            dx = document.documentElement.clientWidth - tooltipBounds.right - 4;
        }

        if (tooltipBounds.top < 0) {
            dy = -tooltipBounds.top + 4;
        } else if (
            tooltipBounds.bottom > document.documentElement.clientHeight
        ) {
            dy = -tooltipBounds.height - elementBounds.height - 4;
        }

        // setting the updated safe positions
        tooltipRef.current.style.left = `${left + dx}px`;
        tooltipRef.current.style.top = `${top + dy}px`;
        tooltipRef.current.style.translate = `${translateX}% ${translateY}%`;
    });
};
