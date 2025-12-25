"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { Spinner } from "@/features/spinner/components/Spinner";
import { useAppStore } from "@/zustand/store";

export const UserProfile = () => {
	// url
	const { id } = useParams<{ id: string | undefined }>();

	// zustand state
	const status = useAppStore((state) => state.status);
	const profiles = useAppStore((state) => state.profiles);
	const profilePromises = useAppStore((state) => state.profilePromises);

	// zustand functions
	const getProfile = useAppStore((state) => state.getProfile);

	// user id to fetch data from
	const user_id =
		status !== null && id === undefined
			? status.user.id
			: id !== undefined
				? id
				: undefined;

	// getting data
	useEffect(() => {
		if (user_id !== undefined) {
			getProfile(user_id);
		}
	}, [user_id, getProfile]);

	// error / routes handling
	if (user_id === undefined) {
		return (
			<div className="box max-w-64 w-full m-auto">
				<AuthRequired description="Log in to see your own profile" />
			</div>
		);
	}

	if (profilePromises?.profile === "pending") {
		return (
			<div className="box max-w-lg w-full m-auto">
                <span>Loading profile...</span>
				<Spinner styles="big" />
			</div>
		);
	}

	return (
		<div className="box max-w-lg w-full m-auto">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<span className="text-center text-foreground-2! text-5!">
						Your profile
					</span>
					<span className="text-center">
						Here you can see and change all of your data
					</span>

					{profiles?.[user_id] === null ? (
						<Spinner styles="big" />
					) : (
						<span>{JSON.stringify(profiles?.[user_id])}</span>
					)}
				</div>
			</div>
		</div>
	);
};
