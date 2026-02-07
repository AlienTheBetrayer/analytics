import { Button } from "@/features/ui/button/components/Button";
import { useLocalStore } from "@/zustand/localStore";
import Image from "next/image";

type Props = {
    className?: string;
    children?: React.ReactNode;
};

export const Theme = ({ className, children }: Props) => {
    // local storage
    const theme = useLocalStore((state) => state.theme);
    const toggleTheme = useLocalStore((state) => state.toggleTheme);

    return (
        <Button
            onClick={toggleTheme}
            className={`p-2! w-full ${className ?? ""}`}
        >
            <Image
                alt="theme"
                src={theme === "dark" ? "/moon.svg" : "/sun.svg"}
                width={18}
                height={18}
                className="transition-all duration-1000!"
                style={{ rotate: theme === "dark" ? "0deg" : "270deg" }}
            />
            {children}
        </Button>
    );
};
