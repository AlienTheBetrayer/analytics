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
        <Button
            onClick={toggleTheme}
            className={`${className ?? ""}`}
        >
            <Image
                alt="theme"
                src="/moon.svg"
                width={16}
                height={16}
                className="transition-all duration-1000!"
                style={{ rotate: theme === "dark" ? "0deg" : "180deg" }}
            />
            {children}
        </Button>
    );
};
