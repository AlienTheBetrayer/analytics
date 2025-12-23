import type { TooltipDirection } from "../types/tooltip";

export const getDirectionStyle = (direction: TooltipDirection) => {
	switch (direction) {
		case "bottom":
			return {
				left: '50%',
				top: "115%",
				transform: "translate(-50%, 0)",
			};
		case "bottom-right":
			return { left: "0", top: "115%", transform: "translate(0, 0)" };
		case "bottom-left":
			return { right: "0", top: "115%", transform: "translate(0, 0)" };
		case "top":
			return { left: "50%", bottom: "115%", transform: "translate(-50%, 0)" };
		case "inside":
			return { top: "50%", transform: "translate(-50%, -50%)" };
		case "left":
			return {
				left: "-8px",
				top: "50%",
				transform: "translate(-100%, -50%)",
			};
		case "right":
			return { left: "100%", top: "50%", transform: "translate(8px, -50%)" };
	}
};
