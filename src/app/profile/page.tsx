"use server";

import { Profile } from "@/features/profile/components/Profile";

const ProfilePage = () => {
	return (
		<main className="relative flex flex-col my-auto w-full">
			<Profile />
		</main>
	);
};

export default ProfilePage;
