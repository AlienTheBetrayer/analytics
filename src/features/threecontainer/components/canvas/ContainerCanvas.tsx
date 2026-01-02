import { Canvas } from "@react-three/fiber";
import { ContainerInstances } from "./ContainerInstances";
import { motion } from "motion/react";

export const ContainerCanvas = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 2 }}
            className="absolute! inset-0 z-0"
        >
            <Canvas>
                <ContainerInstances />
                <ambientLight />
            </Canvas>
        </motion.div>
    );
};
