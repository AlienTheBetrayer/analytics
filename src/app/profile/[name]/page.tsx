"use server";

import { UserProfile } from "@/features/profile/components/UserProfile";

const ProfilePage = () => {
	return (
		<main className="relative flex flex-col w-full">
			<UserProfile />
		</main>
	);
};

export default ProfilePage;
