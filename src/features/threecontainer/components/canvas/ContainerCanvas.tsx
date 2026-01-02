import { Canvas } from "@react-three/fiber";
import { ContainerInstances } from "./ContainerInstances";

export const ContainerCanvas = () => {
    return (
        <Canvas className="absolute! inset-0 z-0">
            <ContainerInstances />
            <ambientLight />
        </Canvas>
    );
};
