"use server";

import { UserProfile } from "@/features/profile/components/UserProfile";

const ProfilePage = () => {
	return (
		<main className="relative flex flex-col my-auto w-full">
			<UserProfile />
		</main>
	);
};

export default ProfilePage;
