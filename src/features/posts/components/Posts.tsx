"use client";
import { AbsentTopline } from "@/features/loading/components/AbsentTopline";
import { LoadingDashboard } from "@/features/loading/components/LoadingDashboard";
import { useParams } from "next/navigation";

export const Posts = () => {
    const { username, id } = useParams<{ id?: string; username?: string }>();

    // incorrect url
    if (!username) {
        return (
            <>
                <AbsentTopline title="User does not exist" />

                <div className="box max-w-400 w-full m-auto rounded-4xl!">
                    <LoadingDashboard />
                </div>
            </>
        );
    }

    // incorrect id
    if (!id) {
        return (
            <>
                <AbsentTopline title="Post does not exist" />

                <div className="box max-w-400 w-full m-auto rounded-4xl!">
                    <LoadingDashboard />
                </div>
            </>
        );
    }

    // main jsx
    return <div className="box max-w-400 w-full m-auto rounded-4xl!"></div>;
};
