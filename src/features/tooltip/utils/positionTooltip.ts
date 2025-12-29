import type { TooltipDirection } from "../types/Tooltip";

/**
 * positions a tooltip with all directions
 * @param tooltipRef the ref of the tooltip that will get positioned
 * @param elementRef the hovered element
 */
export const positionTooltip = (
	tooltipRef: React.RefObject<HTMLDivElement | null>,
	elementRef: React.RefObject<HTMLDivElement | null>,
	direction: TooltipDirection = "bottom",
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
	switch (direction) {
		case "bottom": {
			left = elementBounds.left + elementBounds.width / 2 + window.scrollX;
			top = elementBounds.bottom + window.scrollY;
			tooltipRef.current.style.translate = `-50% 0`;
			break;
		}
		case "top": {
			left = elementBounds.left + elementBounds.width / 2 + window.scrollX;
			top = elementBounds.top + window.scrollY;
			tooltipRef.current.style.translate = `-50% -100%`;
			break;
		}
		case "left": {
			left = elementBounds.left + window.scrollY;
			top = elementBounds.top + elementBounds.height / 2 + window.scrollY;
			tooltipRef.current.style.translate = `-100% -50%`;
			break;
		}
		case "right": {
			left = elementBounds.right + window.scrollY;
			top = elementBounds.top + elementBounds.height / 2 + window.scrollY;
			tooltipRef.current.style.translate = `0 -50%`;
			break;
		}
	}

	// setting the initial positions
	tooltipRef.current.style.display = "flex";
	tooltipRef.current.style.left = `${left}px`;
	tooltipRef.current.style.top = `${top}px`;

	// window boundary overflow check
	const tooltipBounds = tooltipRef.current.getBoundingClientRect();
	let dx = 0;
	if (tooltipBounds.left < 0) {
		dx = -tooltipBounds.left + 2;
	} else if (tooltipBounds.right > window.innerWidth) {
		dx = window.innerWidth - tooltipBounds.right - 4;
	}

	// setting the updated safe positions
	tooltipRef.current.style.left = `${left + dx}px`;
	tooltipRef.current.style.top = `${top}px`;
};
