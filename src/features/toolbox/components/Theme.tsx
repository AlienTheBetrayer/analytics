import { Button } from "@/features/ui/button/components/Button";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

type Props = {
    className?: string;
    children?: React.ReactNode;
};

export const Theme = ({ className, children }: Props) => {
    // localstorage
    const theme = useLocalStore((state) => state.theme);
    const toggleTheme = useLocalStore((state) => state.toggleTheme);

    return (
        <Tooltip text={`Switch to ${theme === "dark" ? "light" : "dark"}`}>
            <Button
                onClick={toggleTheme}
                className={`p-2! w-full ${className ?? ""}`}
            >
                <Image
                    alt="theme"
                    src="/moon.svg"
                    width={18}
                    height={18}
                    className="transition-all duration-1000!"
                    style={{ rotate: theme === "dark" ? "0deg" : "180deg" }}
                />
                {children}
            </Button>
        </Tooltip>
    );
};
