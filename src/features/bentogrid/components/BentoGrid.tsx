import { ThreeContainer } from "@/features/threecontainer/components/ThreeContainer";
import "./BentoGrid.css";

export const BentoGrid = () => {
    return (
        <div className="bento-grid **:text-white!">
            <ThreeContainer style={{ gridArea: "a" }}>
                <span>Caching</span>
            </ThreeContainer>
            <ThreeContainer style={{ gridArea: "b" }}>
                <span>Zustand</span>
            </ThreeContainer>
            <ThreeContainer style={{ gridArea: "c" }}>
                <span>Fetching</span>
            </ThreeContainer>
            <ThreeContainer style={{ gridArea: "d" }}>
                <span>API</span>
            </ThreeContainer>
            <ThreeContainer style={{ gridArea: "e" }}>
                <span>Database</span>
            </ThreeContainer>
            <ThreeContainer style={{ gridArea: "f" }}>
                <span>Permissions</span>
            </ThreeContainer>
            <ThreeContainer style={{ gridArea: "k" }}>
                <span>Authentication</span>
            </ThreeContainer>
            <ThreeContainer style={{ gridArea: "l" }}>
                <span>SDK (npm)</span>
            </ThreeContainer>
            <ThreeContainer style={{ gridArea: "o" }}>
                <span>Analytics</span>
            </ThreeContainer>
        </div>
    );
};
