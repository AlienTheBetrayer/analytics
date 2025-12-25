"use client";

import { useParams } from "next/navigation";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { useAppStore } from "@/zustand/store";

export const Profile = () => {
	// url
	const { id } = useParams<{ id: string | undefined }>();

	// zustand state
	const status = useAppStore((state) => state.status);

	if (status === null || status.isLoggedIn === false) {
		return (
			<div className="box max-w-64 w-full m-auto">
				<AuthRequired />
			</div>
		);
	}

	if (id !== undefined) {
	}

	return (
		<div className="box max-w-lg w-full m-auto">
			<span>currenty logged in!</span>
			<span>role: {status.role}</span>
		</div>
	);
};
