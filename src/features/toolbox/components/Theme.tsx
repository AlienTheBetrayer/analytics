import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { Button } from "@/features/ui/button/components/Button";
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
        <Tooltip
            text="Toggle theme"
            className="w-full"
        >
            <Button
                onClick={toggleTheme}
                className={`p-0! w-full ${className ?? ""}`}
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
