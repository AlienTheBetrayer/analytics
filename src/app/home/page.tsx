"use client";

import { BentoGrid } from "@/features/bentogrid/components/BentoGrid";

const HomePage = () => {
    return (
        <main className="relative w-full max-w-400 min-h-screen flex flex-col mx-auto gap-1">
            <BentoGrid />
        </main>
    );
};

export default HomePage;
