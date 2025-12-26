"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { retrieveResponse } from "@/features/authentication/utils/retrieveResponse";
import { Spinner } from "@/features/spinner/components/Spinner";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { APIResponseType } from "@/types/api/response";
import { useAppStore } from "@/zustand/store";
import { ProfileEdit } from "./ProfileEdit";
import { Overview } from "./tabs/Overview";

export const UserProfile = () => {
	// url
	const { name } = useParams<{ name: string | undefined }>();

	// zustand state
	const status = useAppStore((state) => state.status);
	const profiles = useAppStore((state) => state.profiles);
	const profilePromises = useAppStore((state) => state.profilePromises);

	// zustand functions
	const getProfile = useAppStore((state) => state.getProfile);

	// user id to fetch data from
	const retrievedUsername = name ?? status?.user.username;

	// getting data + status
	const [responseStatus, setResponseStatus] = useState<
		APIResponseType | undefined
	>();

	useEffect(() => {
		if (retrievedUsername === undefined) return;

		const get = async () => {
			const res = await retrieveResponse(
				async () => await getProfile(retrievedUsername),
			);
			setResponseStatus(res.retrievedResponse.type);
		};

		get();
	}, [retrievedUsername, getProfile]);

	// viewing current profile but not logged in
	if (retrievedUsername === undefined) {
		return (
			<div className="box max-w-64 w-full m-auto">
				<AuthRequired description="Log in to see your own profile" />
			</div>
		);
	}

	// wrong user
	if (
		responseStatus === "user_not_exists" ||
		responseStatus === "profile_not_exists"
	) {
		return (
			<div className="box max-w-lg w-full m-auto">
				<div className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<span className="text-center text-foreground-2! text-5!">
							<u>Wrong</u> user!
						</span>
						<span className="text-center">
							The user has either not created a profile yet or they don't exist.
						</span>
					</div>

					<hr />
					<div>
						<LinkButton href="/home">
							<Image width={16} height={16} src="/cube.svg" alt="" />
							Go back home
						</LinkButton>
					</div>
				</div>
			</div>
		);
	}

	if (
		profilePromises?.profile === "pending" ||
		profiles?.[retrievedUsername] === undefined
	) {
		return (
			<div className="box max-w-lg w-full m-auto">
				<span className="m-auto">Loading profile...</span>
				<Spinner styles="big" />
			</div>
		);
	}

	const data = profiles[retrievedUsername];

	return (
		<div className="box max-w-xl w-full m-auto min-h-128! p-0!">
            {data.user.id !== status?.user.id ? (
                <Overview data={data} />
            ) : (
                <ProfileEdit data={data}/>
            )}
		</div>
	);
};
