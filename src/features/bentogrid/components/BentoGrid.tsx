import "./BentoGrid.css";

export const BentoGrid = () => {
    return (
        <div className="bento-grid">
            <div style={{ gridArea: "a" }}></div>
            <div style={{ gridArea: "b" }}></div>
        </div>
    );
};
