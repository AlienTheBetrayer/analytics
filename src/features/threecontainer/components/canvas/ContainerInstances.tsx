import { Instance, Instances } from "@react-three/drei";
import { STARS_QUANTITY, useStars } from "../../hooks/useStars";
import { useRef } from "react";
import { InstancedMesh } from "three";

export const ContainerInstances = () => {
    // refs
    const instancesRef = useRef<InstancedMesh | null>(null);

    // controller
    useStars(instancesRef);

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
