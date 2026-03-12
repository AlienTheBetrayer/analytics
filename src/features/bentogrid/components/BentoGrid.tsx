import { ThreeContainer } from "@/features/threecontainer/components/ThreeContainer";
import "./BentoGrid.css";
import { UseQuery } from "@/features/bentogrid/components/sections/UseQuery";
import { UI } from "@/features/bentogrid/components/sections/UI";
import { Permissions } from "@/features/bentogrid/components/sections/Permissions";
import { Zustand } from "@/features/bentogrid/components/sections/Zustand";
import { Realtime } from "@/features/bentogrid/components/sections/Realtime";
import { JWT } from "@/features/bentogrid/components/sections/JWT";
import { NPM } from "@/features/bentogrid/components/sections/NPM";
import { SWR } from "@/features/bentogrid/components/sections/SWR";
import { Typescript } from "@/features/bentogrid/components/sections/Typescript";

export const BentoGrid = () => {
    return (
        <ul className="bento-grid">
            <li style={{ gridArea: "a" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <Typescript />
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "b" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <SWR />
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "c" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <NPM />
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "d" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <JWT />
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "e" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <UseQuery />
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "f" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <UI />
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "k" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <Permissions />
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "l" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <Zustand />
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "o" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <Realtime />
                    </div>
                </ThreeContainer>
            </li>
        </ul>
    );
};
