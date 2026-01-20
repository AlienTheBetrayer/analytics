/**
 * type of the pointer event
 */
type RipplePointerType = "down" | "enter";

/**
 * state for the ripple effect map
 */
type RippleState = {
    scheduledDisable: boolean;
    hasAnimationFinished: boolean;
    timeout: NodeJS.Timeout;
};

/**
 * state map containing all the buttons and their ripple status
 */
const rippleState = new WeakMap<HTMLElement, RippleState>();

/**
 * safely returns the ripple state for the button and defaults it if it hadn't been initialized
 * @param el the element of the button
 * @returns state object for the ripple button
 */
const rippleStateDefault = (el: HTMLElement) => {
    let state = rippleState.get(el);
    if (!state) {
        state = {
            hasAnimationFinished: false,
            scheduledDisable: false,
            timeout: null!,
        };
        rippleState.set(el, state);
    }

    return state;
};

/**
 * enables the ripple effect on a given button based on its event
 * @param e the event
 * @param type down will always enable it, enter will enable only if left button is pressed
 */
export const rippleEnable = <T extends HTMLElement>(
    e: React.PointerEvent<T>,
    type: RipplePointerType = "down",
) => {
    const el = e.currentTarget as HTMLElement;

    if (!el) {
        return;
    }

    if (!(type === "down" || (type === "enter" && e.buttons === 1))) {
        return;
    }

    // ripple status
    const state = rippleStateDefault(el) satisfies RippleState;

    // variable setting
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--y", `${e.clientY - rect.top}px`);
    el.dataset.ripple = "on";

    // scheduling / animation
    state.hasAnimationFinished = false;

    clearTimeout(state.timeout);
    state.timeout = setTimeout(() => {
        state.hasAnimationFinished = true;

        if (state.scheduledDisable) {
            el.dataset.ripple = "off";
            state.scheduledDisable = false;
        }
    }, 600);
};

/**
 * disables the ripple effect on a given button based on its event
 * @param e the event
 */
export const rippleDisable = <T extends HTMLElement>(
    e: React.PointerEvent<T>,
) => {
    const el = e.currentTarget as HTMLElement;

    if (!el) {
        return;
    }

    const state = rippleState.get(el);

    if (!state || el.dataset.ripple !== "on") {
        return;
    }

    if (state.hasAnimationFinished) {
        el.dataset.ripple = "off";
    } else {
        state.scheduledDisable = true;
    }
};
