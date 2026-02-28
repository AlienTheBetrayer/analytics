export const rippleEnable = <T extends HTMLElement>(
    e: React.PointerEvent<T>,
) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();

    // creating
    const ripple = document.createElement("span");
    ripple.classList.add("ripple-element");

    const size = Math.max(rect.width, rect.height) * 2.5;
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    el.appendChild(ripple);

    // animation
    ripple.animate(
        [
            { transform: "translate(-50%, -50%) scale(0)", opacity: 1 },
            { transform: "translate(-50%, -50%) scale(1)", opacity: 1 },
        ],
        {
            duration: Math.max(500, Math.min(size, 900)),
            easing: "cubic-bezier(0.27,0.75,1.00,0.62)",
            fill: "forwards",
        },
    );

    // handler
    const handle = () => {
        const fade = ripple.animate([{ opacity: 1 }, { opacity: 0 }], {
            duration: 750,
            easing: "ease-out",
            fill: "forwards",
        });

        fade.onfinish = () => ripple.remove();

        // Clean up listeners
        window.removeEventListener("pointerup", handle);
        window.removeEventListener("pointercancel", handle);
        el.removeEventListener("pointerleave", handle);
    };

    // adding listeners
    window.addEventListener("pointerup", handle);
    window.addEventListener("pointercancel", handle);
    el.addEventListener("pointerleave", handle);
};
