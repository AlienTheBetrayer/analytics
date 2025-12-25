"use server";

import { Profile } from "@/features/profile/components/UserProfile";

const ProfileIDPage = () => {
	return (
		<main className="relative flex flex-col my-auto w-full">
			<Profile />
		</main>
	);
};

export default ProfileIDPage;
