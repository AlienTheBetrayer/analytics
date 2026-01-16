import type { TooltipDirection } from "../types/tooltip";

/**
 * positions a tooltip with all directions
 * @param tooltipRef the ref of the tooltip that will get positioned
 * @param elementRef the hovered element
 */
export const positionTooltip = (
    tooltipRef: React.RefObject<HTMLDivElement | null>,
    elementRef: React.RefObject<HTMLDivElement | null>,
    direction: TooltipDirection = "bottom"
) => {
    // safety flag
    if (!tooltipRef.current || !elementRef.current) {
        return;
    }

    // getting the bounds of the element
    const elementBounds = elementRef.current.getBoundingClientRect();

    // calculating and setting the direction
    let left = 0;
    let top = 0;

    tooltipRef.current.style.display = "flex";
    const tooltipBounds = tooltipRef.current.getBoundingClientRect();

    switch (direction) {
        case "bottom": {
            left =
                elementBounds.left +
                elementBounds.width / 2 +
                window.scrollX -
                tooltipBounds.width / 2;
            top = elementBounds.bottom + window.scrollY;
            break;
        }
        case "top": {
            left =
                elementBounds.left +
                elementBounds.width / 2 +
                window.scrollX -
                tooltipBounds.width / 2;
            top = elementBounds.top + window.scrollY - tooltipBounds.height;
            break;
        }
        case "left": {
            left = elementBounds.left + window.scrollX - tooltipBounds.width;
            top =
                elementBounds.top +
                elementBounds.height / 2 +
                window.scrollY -
                tooltipBounds.height / 2;
            break;
        }
        case "right": {
            left = elementBounds.right + window.scrollX;
            top =
                elementBounds.top +
                elementBounds.height / 2 +
                window.scrollY -
                tooltipBounds.height / 2;
            break;
        }
        case "bottom-right": {
            left = elementBounds.right + window.scrollX;
            top = elementBounds.top + window.scrollY - 4;
            break;
        }
        case "bottom-left": {
            left = elementBounds.left + window.scrollX - tooltipBounds.width;
            top = elementBounds.top + window.scrollY - 4;
            break;
        }
        case "top-right": {
            left = elementBounds.right + window.scrollX;
            top = elementBounds.top + window.scrollY + 4 - tooltipBounds.height + elementBounds.height;
            break;
        }
        case "top-left": {
            left = elementBounds.left + window.scrollX - tooltipBounds.width;
            top = elementBounds.top + window.scrollY + 4 - tooltipBounds.height + elementBounds.height;
            break;
        }
    }

    // setting the initial positions
    tooltipRef.current.style.left = `${left}px`;
    tooltipRef.current.style.top = `${top}px`;

    // // window boundary overflow check
    let dx = 0;
    if (left < scrollX) {
        dx = scrollX - left + 2;
    } else if (left + tooltipBounds.width > scrollX + document.documentElement.clientWidth) {
        dx = scrollX + document.documentElement.clientWidth - left - tooltipBounds.width - 4;
    }

    let dy = 0;
    if (top < scrollY) {
        dy = scrollY - top + 2;
    } else if (top + tooltipBounds.height > scrollY + window.innerHeight) {
        dy = scrollY + window.innerHeight - top - tooltipBounds.height - 2;
    }

    // setting the updated safe positions
    tooltipRef.current.style.left = `${left + dx}px`;
    tooltipRef.current.style.top = `${top + dy}px`;
};
