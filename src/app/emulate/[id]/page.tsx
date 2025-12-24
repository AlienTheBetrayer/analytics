"use client";
import { useParams } from "next/navigation";
import { Emulate } from "@/features/emulate/components/Emulate";
import { useRedirect } from "@/hooks/useRedirect";
import { useAppStore } from "@/zustand/store";

const EmulatePage = () => {
	// zustand
	const status = useAppStore((state) => state.status);

	// url
	const { id } = useParams();

	// redirecting if anything went wrong
	const check =
		typeof id !== "string" ||
		status?.isLoggedIn !== true ||
		status?.role === "user";
        
        useRedirect(check, "/dashboard");
    if(check)
        return null;

	return (
		<main className="relative flex flex-col m-auto w-full">
			<Emulate currentId={id} />
		</main>
	);
};

export default EmulatePage;
