"use client";
import { useParams } from "next/navigation";

export const Posts = () => {
    const { username, id } = useParams<{ id?: string; username?: string }>();

    return (
        <div className="box max-w-400 w-full m-auto p-0! rounded-4xl!"></div>
    );
};
