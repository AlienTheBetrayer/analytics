/* eslint-disable react-hooks/purity */
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useMemo } from "react";
import { createNoise3D } from "simplex-noise";
import { InstancedMesh, Matrix4, Vector3 } from "three";

export const STARS_QUANTITY = 125;

/**
 * a custom hook used to generate and move all the stars
 * @param instancesRef - the ref object for the <Instances/>
 */
export const useStars = (
    instancesRef: React.RefObject<InstancedMesh | null>
) => {
    // 3js states
    const { viewport } = useThree();

    // base positions
    const base = useMemo(() => {
        return Array.from(
            { length: STARS_QUANTITY },
            () =>
                new Vector3(
                    (Math.random() - 0.5) * viewport.width,
                    (Math.random() - 0.5) * viewport.height,
                    0
                )
        );
    }, [viewport.width, viewport.height]);

    // noise + matrix
    const matrix = useMemo(() => new Matrix4(), []);
    const pos = useMemo(() => new Vector3(), []);
    const noise = useMemo(() => createNoise3D(), []);

    useFrame(({ clock }) => {
        if (!instancesRef.current) {
            return;
        }

        const t = clock.elapsedTime * 0.5; 

        for (let i = 0; i < base.length; i++) {
            const b = base[i];
            const dz = noise(b.x * 10, b.y * 10, Math.cos(t)) * 0.15;
            pos.set(b.x, b.y, b.z + dz);

            matrix.setPosition(pos);
            instancesRef.current.setMatrixAt(i, matrix);
        }

        instancesRef.current.instanceMatrix.needsUpdate = true;
    });
};
