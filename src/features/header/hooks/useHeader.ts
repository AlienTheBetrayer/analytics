import { useDisabledScroll } from "@/hooks/useDisabledScroll";
import { useRef, useEffect, useState, useCallback } from "react";

export const useHeader = () => {
    // states
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

    // scrolling disability while in menu
    const disabledScroll = useDisabledScroll();

    // refs (scrolling system)
    const headerRef = useRef<HTMLHeadElement | null>(null);
    const lastScroll = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout>(undefined);

    // scrolling system
    useEffect(() => {
        const handle = () => {
            const scroll = window.scrollY;

            clearTimeout(timeoutRef.current);

            timeoutRef.current = setTimeout(() => {
                if (!headerRef.current) {
                    return;
                }

                const diff = scroll - lastScroll.current;

                if (diff > 42) {
                    headerRef.current.style.top = "-5rem";
                    headerRef.current.style.opacity = "0";
                    headerRef.current.style.transform = `scale(0.85)`;
                } else if (diff < -8) {
                    headerRef.current.style.top = "1rem";
                    headerRef.current.style.opacity = "1";
                    headerRef.current.style.transform = `scale(1)`;
                }
                lastScroll.current = scroll;
            }, 50);
        };

        window?.addEventListener("scroll", handle);
        return () => window?.removeEventListener("scroll", handle);
    }, []);

    useEffect(() => {
        disabledScroll.setIsDisabled(isMenuOpen);
    }, [disabledScroll, isMenuOpen]);

    useEffect(() => {
        const handle = (e: KeyboardEvent) => {
            switch (e.code) {
                case "Escape":
                    setIsMenuOpen(false);
                    break;
            }
        };

        window.addEventListener("keydown", handle);
        return () => window.removeEventListener("keydown", handle);
    }, []);

    // user functions
    const showMenu = useCallback(() => {
        setIsMenuOpen(true);
    }, []);
    
    const hideMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    return {
        showMenu,
        hideMenu,
        isMenuOpen,
        headerRef,
    };
};
