/**
 * the type of the pointer event
 */
type RipplePointerType = "down" | "enter";

let scheduledDisable = false;
let hasAnimationFinished = false;
let timeout: NodeJS.Timeout;

/**
 * enables the ripple effect on a given button based on its event
 * @param e the event
 * @param type down will always enable it, enter will enable only if left button is pressed
 */
export const rippleEnable = <T extends HTMLElement>(
    e: React.PointerEvent<T>,
    type: RipplePointerType = "down",
) => {
    const el = e.currentTarget;

    if (!el) {
        return;
    }

    if (type === "down" || (type === "enter" && e.buttons === 1)) {
        const rect = el.getBoundingClientRect();
        el.style.setProperty("--x", `${e.clientX - rect.left}px`);
        el.style.setProperty("--y", `${e.clientY - rect.top}px`);

        el.dataset.ripple = "on";

        // scheduling / animation
        hasAnimationFinished = false;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            hasAnimationFinished = true;
            if (scheduledDisable) {
                el.dataset.ripple = "off";
                scheduledDisable = false;
            }
        }, 750);
    }
};

/**
 * disables the ripple effect on a given button based on its event
 * @param e the event
 */
export const rippleDisable = <T extends HTMLElement>(
    e: React.PointerEvent<T>,
) => {
    const el = e.currentTarget;

    if (!el) {
        return;
    }

    if (el.dataset.ripple === "on") {
        if (hasAnimationFinished) {
            el.dataset.ripple = "off";
        } else {
            scheduledDisable = true;
        }
    }
};
