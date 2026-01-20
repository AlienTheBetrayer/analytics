import { ContainerCanvas } from "./canvas/ContainerCanvas";

type Props = {} & React.ComponentPropsWithoutRef<"div">;

export const ThreeContainer = ({
    className = "",
    children,
    ...rest
}: Props) => {
    return (
        <div className={`box p-0! overflow-hidden w-full h-full ${className}`} {...rest}>
            <ContainerCanvas />

            <div className="z-2 w-full h-full">{children}</div>
        </div>
    );
};
