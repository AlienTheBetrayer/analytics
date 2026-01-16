"use client";
import { Button } from "@/features/ui/button/components/Button";
import { useParams } from "next/navigation";

export const Search = () => {
    const { query } = useParams<{ query?: string }>();

    if (!query) {
        return (
            <>
                <div
                    className={`box p-0! gap-1! my-2 flex-row! max-w-400 w-full m-auto transition-all duration-500 h-10 items-center`}
                >
                    <Button>hi</Button>
                </div>

                <div className="box w-full max-w-400">hi</div>
            </>
        );
    }

    return (
        <div className="box">
            <span>hi</span>
            <span>hi</span>
            <span>hi</span>
            <span>hi</span>
            <span>hi</span>
            <span>hi</span>
        </div>
    );
};
