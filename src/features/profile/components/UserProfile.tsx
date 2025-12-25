"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { retrieveResponse } from "@/features/authentication/utils/retrieveResponse";
import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import type { APIResponseType } from "@/types/api/response";
import { useAppStore } from "@/zustand/store";

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
		<div className="box max-w-xl w-full m-auto">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<span className="text-center text-foreground-2! text-5!">
						<mark>{data.user.username}</mark>
						's profile
					</span>
				</div>

				<hr />
				<div className="flex flex-col sm:flex-row gap-4">
					<div className="flex flex-col items-center gap-2">
						<div className="bg-blue-3 rounded-full h-48 aspect-square" />
						<span className="text-foreground-5!">
							{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
						</span>
					</div>

					<hr className="flex sm:w-px! h-full!" />
					<div className="flex flex-col w-full gap-4">
						<div className="flex flex-col gap-2">
							<Input placeholder="Status" />
							<Input placeholder="Bio" />
							<Input placeholder="Bio" />
						</div>

						<hr className="mt-auto" />
						<div className="flex flex-col gap-2">
							<Button>
								<Image width={20} height={20} src="/send.svg" alt="" />
								Apply changes
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};
