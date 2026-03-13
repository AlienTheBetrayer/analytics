export const PopoverDirections = [
    "top",
    "bottom",
    "left",
    "right",
    "bottom-right",
    "bottom-left",
    "top-right",
    "top-left",
    "middle",
    "screen-middle",
] as const;

export type PopoverDirection = (typeof PopoverDirections)[number];
