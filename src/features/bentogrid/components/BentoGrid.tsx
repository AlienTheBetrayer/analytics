import { ThreeContainer } from "@/features/threecontainer/components/ThreeContainer";
import "./BentoGrid.css";

export const BentoGrid = () => {
    return (
        <div className="bento-grid">
            <ThreeContainer style={{ gridArea: "a" }}>Caching</ThreeContainer>
            <ThreeContainer style={{ gridArea: "b" }}>Zustand</ThreeContainer>
            <ThreeContainer style={{ gridArea: "c" }}>Fetching</ThreeContainer>
            <ThreeContainer style={{ gridArea: "d" }}>API</ThreeContainer>
            <ThreeContainer style={{ gridArea: "e" }}>Database</ThreeContainer>
            <ThreeContainer style={{ gridArea: "f" }}>Permissions</ThreeContainer>
            <ThreeContainer style={{ gridArea: "k" }}>Authentication</ThreeContainer>
            <ThreeContainer style={{ gridArea: "l" }}>SDK (npm)</ThreeContainer>
            <ThreeContainer style={{ gridArea: "o" }}>Analytics</ThreeContainer>

        </div>
    );
};
