"use client";

import { BentoGrid } from "@/features/bentogrid/components/BentoGrid";

const HomePage = () => {
    return (
        <main className="relative w-full max-w-360 min-h-screen flex flex-col mx-auto">
            <BentoGrid />
        </main>
    );
};

export default HomePage;
