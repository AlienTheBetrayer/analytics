/* eslint-disable react-hooks/purity */
import { useFrame } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { InstancedMesh, Matrix4, Vector3 } from "three";

export const STARS_QUANTITY = 200;

/**
 * a custom hook used to generate and move all the stars
 * @param instancesRef - the ref object for the <Instances/>
 */
export const useStars = (
    instancesRef: React.RefObject<InstancedMesh | null>,
    isHovered?: boolean
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

    const hoverProgress = useRef<number>(0);

    useFrame(({ clock }, delta) => {
        if (!instancesRef.current) return;

        const t = clock.elapsedTime;

        hoverProgress.current += (isHovered ? 1 : -1) * delta * 0.3;
        hoverProgress.current = Math.min(1, Math.max(0, hoverProgress.current));

        const hp = hoverProgress.current;
        const snap = hp * hp;

        for (let i = 0; i < base.length; i++) {
            const b = base[i];

            // stars
            const starZ = noise(b.x * 8, b.y * 8, t * 0.3) * 0.2;

            const sx = b.x;
            const sy = b.y;
            const sz = b.z + starZ;

            // galaxy
            const r = Math.sqrt(b.x * b.x + b.y * b.y) + 0.0001;

            const nr = Math.min(r / 4, 1);

            // deterministic randomness
            const hash = Math.sin(i * 12.9898) * 43758.5453;
            const rand = hash - Math.floor(hash);

            // spiral arms
            const armIndex = Math.floor(rand * 4);
            const armOffset = (armIndex * Math.PI * 2) / 4;

            const spiralAngle =
                Math.log(r) * 6 + armOffset + t * (1 - nr) * 2.5;

            const galaxyR = r * (0.25 + nr);

            const gx = Math.cos(spiralAngle) * galaxyR;
            const gy = Math.sin(spiralAngle) * galaxyR;

            // depth
            let gz = (rand - 0.5) * 1.8 * (1 - nr);

            // central bulge
            gz += Math.exp(-r * 3) * 1.6 * (rand - 0.5);

            // tilt
            const tilt = Math.PI / 5;

            const ty = gy * Math.cos(tilt) - gz * Math.sin(tilt);
            const tz = gy * Math.sin(tilt) + gz * Math.cos(tilt);

            // blend
            pos.set(
                sx + (gx - sx) * snap,
                sy + (ty - sy) * snap,
                sz + (tz - sz) * snap
            );

            matrix.setPosition(pos);
            instancesRef.current.setMatrixAt(i, matrix);
        }

        instancesRef.current.instanceMatrix.needsUpdate = true;
    });
};
