import { ThreeContainer } from "@/features/threecontainer/components/ThreeContainer";
import "./BentoGrid.css";

export const BentoGrid = () => {
    return (
        <div className="bento-grid">
            <ThreeContainer style={{ gridArea: "a" }}>A</ThreeContainer>
            <ThreeContainer style={{ gridArea: "b" }}>B</ThreeContainer>
            <ThreeContainer style={{ gridArea: "c" }}>C</ThreeContainer>
            <ThreeContainer style={{ gridArea: "d" }}>D</ThreeContainer>
            <ThreeContainer style={{ gridArea: "e" }}>E</ThreeContainer>
            <ThreeContainer style={{ gridArea: "f" }}>F</ThreeContainer>
            <ThreeContainer style={{ gridArea: "g" }}>G</ThreeContainer>
        </div>
    );
};
