import { Instance, Instances } from "@react-three/drei";
import { STARS_QUANTITY, useStars } from "../../hooks/useStars";
import { useRef } from "react";
import { InstancedMesh } from "three";
import { useLocalStore } from "@/zustand/localStore";

type Props = {
    isHovered?: boolean;
}

export const ContainerInstances = ({ isHovered }: Props) => {
    // zustand localstorage
    const theme = useLocalStore(state => state.theme);
    
    // refs
    const instancesRef = useRef<InstancedMesh | null>(null);

    // controller
    useStars(instancesRef, isHovered);

    return (
        <Instances ref={instancesRef}>
            <sphereGeometry args={[theme === "dark" ? 0.01 : 0.02]} />
            <meshBasicMaterial color={`${theme === "dark" ? "white" : "black"}`} />

            {Array.from({ length: STARS_QUANTITY }).map((pos, i) => (
                <Instance key={i} />
            ))}
        </Instances>
    );
};
