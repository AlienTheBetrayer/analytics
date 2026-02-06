"use client";
import { Select } from "@/features/contact/components/Select";
import { Topline } from "@/features/contact/components/Topline";
import { useQuery } from "@/query/core";

export const Contact = () => {
    // fetching
    const { data: status } = useQuery({ key: ["status"] });
    useQuery({
        key: ["contact_messages", status?.id],
    });

    return (
        <>
            <Topline />

            <div className="box w-full max-w-400 mx-auto min-h-128">
                <Select />
            </div>
        </>
    );
};
