import { ContainerCanvas } from "./canvas/ContainerCanvas";

type Props = {} & React.ComponentPropsWithoutRef<"div">;

export const ThreeContainer = ({
    className = "",
    children,
    ...rest
}: Props) => {
    return (
        <div className={`box overflow-hidden ${className}`} {...rest}>
            <ContainerCanvas />

            <div className="z-2">{children}</div>
        </div>
    );
};
