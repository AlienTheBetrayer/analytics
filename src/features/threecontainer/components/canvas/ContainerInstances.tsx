import { Instance, Instances } from "@react-three/drei";
import { STARS_QUANTITY, useStars } from "../../hooks/useStars";
import { useRef } from "react";
import { InstancedMesh } from "three";

type Props = {
    isHovered?: boolean;
}

export const ContainerInstances = ({ isHovered }: Props) => {
    // refs
    const instancesRef = useRef<InstancedMesh | null>(null);

    // controller
    useStars(instancesRef, isHovered);

    return (
        <Instances ref={instancesRef}>
            <sphereGeometry args={[0.01]} />
            <meshBasicMaterial color="white" />

            {Array.from({ length: STARS_QUANTITY }).map((pos, i) => (
                <Instance key={i} />
            ))}
        </Instances>
    );
};
