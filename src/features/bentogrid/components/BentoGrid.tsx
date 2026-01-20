import { ThreeContainer } from "@/features/threecontainer/components/ThreeContainer";
import "./BentoGrid.css";

export const BentoGrid = () => {
    return (
        <ul className="bento-grid **:text-white!">
            <li style={{ gridArea: "a" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "b" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "c" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "d" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "e" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "f" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "k" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "l" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>

            <li style={{ gridArea: "o" }}>
                <ThreeContainer>
                    <div className="grid place-items-center h-full">
                        <span>Caching</span>
                    </div>
                </ThreeContainer>
            </li>
        </ul>
    );
};
