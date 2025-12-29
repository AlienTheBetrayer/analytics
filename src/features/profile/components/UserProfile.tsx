"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { AuthRequired } from "@/features/authentication/components/AuthRequired";
import { retrieveResponse } from "@/features/authentication/utils/retrieveResponse";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import type { APIResponseType } from "@/types/api/response";
import { useAppStore } from "@/zustand/store";
import { NotFound } from "./NotFound";
import { PrivateVisiblity } from "./PrivateVisibility";
import { ProfileEdit, ProfileTabs } from "./ProfileEdit";
import { Overview } from "./tabs/Overview";
import { UserLoading } from "./UserLoading";

export const UserProfile = () => {
	// url
	const { name, tab } = useParams<{
		name: string | undefined;
		tab: string | undefined;
	}>();

	// zustand state
	const status = useAppStore((state) => state.status);
	const profiles = useAppStore((state) => state.profiles);
	const friends = useAppStore((state) => state.friends);

	// zustand functions
	const getProfileByName = useAppStore((state) => state.getProfileByName);

	// user id to fetch data from
	const retrievedUsername = name ?? status?.user.username;
	const retrievedTab =
		(tab && ProfileTabs.find((t) => t === tab)) || "overview";

	// getting data + status
	const [responseStatus, setResponseStatus] = useState<
		APIResponseType | undefined
	>();
	const [retrievedData, setRetrievedData] = useState<
		| {
				user: User;
				profile: Profile;
		  }
		| undefined
	>(() => {
		return profiles === undefined
			? undefined
			: Object.values(profiles).find(
					(p) => p.user.username === retrievedUsername,
				);
	});

	// fetch if haven't cached
	useEffect(() => {
		if (retrievedUsername === undefined || retrievedData !== undefined) return;

		const get = async () => {
			const res = await retrieveResponse(
				async () => await getProfileByName(retrievedUsername),
			);
			setResponseStatus(res.retrievedResponse.type);
			setRetrievedData(res.axiosResponse?.data);
		};

		get();
	}, [retrievedData, retrievedUsername, getProfileByName]);

	// update state if something about the profile changed
	const profile =
		retrievedData && profiles ? profiles[retrievedData?.user.id] : undefined;
	useEffect(() => {
		if (profile) {
			setRetrievedData(profile);
		}
	}, [profile]);

	// viewing current profile but not logged in
	if (retrievedUsername === undefined) {
		return <AuthRequired description="Log in to see your own profile" />;
	}

	// wrong user
	if (
		responseStatus === "user_not_exists" ||
		responseStatus === "profile_not_exists"
	) {
		return <NotFound />;
	}

	// loading user
	if (retrievedData === undefined) {
		return <UserLoading />;
	}

	// retrieved data from the retrieved user based on the url
	const data = retrievedData;

	// private visibility
	if (
		!(
			data.user.id === status?.user.id ||
			data.profile.visibility === "everyone" ||
			(data.profile.visibility === "friends" &&
				friends?.some((id) => id === data.user.id))
		)
	) {
		return <PrivateVisiblity />;
	}

	return (
		<div
			className={`box max-w-5xl w-full m-auto min-h-128 p-0! rounded-3xl! overflow-hidden`}
			style={
				data.profile.color
					? {
							outline: `1px solid ${data.profile.color}`,
						}
					: {}
			}
		>
			{data.user.id !== status?.user.id ? (
				<Overview data={data} />
			) : (
				<ProfileEdit data={data} tab={retrievedTab} />
			)}
		</div>
	);
};
