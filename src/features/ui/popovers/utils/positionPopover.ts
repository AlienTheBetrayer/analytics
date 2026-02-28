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
    const tooltipBounds = tooltipRef.current.getBoundingClientRect();

    // calculating and setting the direction
    let left = 0;
    let top = 0;

    switch (direction) {
        case "bottom": {
            left =
                elementBounds.left +
                elementBounds.width / 2 -
                tooltipBounds.width / 2;
            top = elementBounds.bottom;
            break;
        }
        case "top": {
            left =
                elementBounds.left +
                elementBounds.width / 2 -
                tooltipBounds.width / 2;
            top = elementBounds.top - tooltipBounds.height;
            break;
        }
        case "left": {
            left = elementBounds.left - tooltipBounds.width;
            top =
                elementBounds.top +
                elementBounds.height / 2 -
                tooltipBounds.height / 2;
            break;
        }
        case "right": {
            left = elementBounds.right;
            top =
                elementBounds.top +
                elementBounds.height / 2 -
                tooltipBounds.height / 2;
            break;
        }
        case "bottom-right": {
            left = elementBounds.left;
            top = elementBounds.bottom + 4;
            break;
        }
        case "bottom-left": {
            left = elementBounds.right - tooltipBounds.width;
            top = elementBounds.bottom + 4;
            break;
        }
        case "top-right": {
            left = elementBounds.left;
            top = elementBounds.top - 4 - tooltipBounds.height;
            break;
        }
        case "top-left": {
            left = elementBounds.right - tooltipBounds.width;
            top = elementBounds.top - 4 - tooltipBounds.height;
            break;
        }
        case "middle": {
            left =
                elementBounds.left +
                elementBounds.width / 2 -
                tooltipBounds.width / 2;
            top =
                elementBounds.top +
                elementBounds.height / 2 -
                tooltipBounds.height / 2;
            break;
        }
        case "screen-middle": {
            left = document.documentElement.clientWidth / 2 - tooltipBounds.width / 2;
            top = window.innerHeight / 2 - tooltipBounds.height / 2;
            break;
        }
    }

    if (left < 0) {
        left = 0;
    }

    if (left + tooltipBounds.width > document.documentElement.clientWidth) {
        left = document.documentElement.clientWidth - tooltipBounds.width;
    }

    if (top < 0) {
        top = 0;
    }

    if (top + tooltipBounds.height > document.documentElement.clientHeight) {
        top = document.documentElement.clientHeight - tooltipBounds.height;
    }

    // setting the initial positions
    tooltipRef.current.style.left = `${left}px`;
    tooltipRef.current.style.top = `${top}px`;
};
