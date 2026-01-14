type Props = {
    condition: boolean;
    color?: string;
    className?: string;
};

export const TabSelection = ({ condition, color, className }: Props) => {
    return (
        <div
            className={`absolute right-1 top-1 rounded-full w-1 h-1 transition-all duration-500 ${className ?? ""}`}
            style={{
                background: condition
                    ? (color ?? "var(--blue-1)")
                    : "transparent",
            }}
        />
    );
};
