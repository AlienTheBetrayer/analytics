import { Canvas } from "@react-three/fiber";
import { ContainerInstances } from "./ContainerInstances";
import { motion } from "motion/react";
import { useState } from "react";

export const ContainerCanvas = () => {
    const [isHovered, setIsHovered] = useState<boolean>(false);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            className="absolute! inset-0 z-0"
        >
            <Canvas>
                <ContainerInstances isHovered={isHovered}/>
                <ambientLight />
            </Canvas>
        </motion.div>
    );
};
