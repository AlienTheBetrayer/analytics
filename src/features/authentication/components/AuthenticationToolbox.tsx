"use client";

import Image from "next/image";
import { ProfileImage } from "@/features/profile/components/ProfileImage";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { Spinner } from "../../spinner/components/Spinner";

export const AuthenticationToolbox = () => {
	// zustand
	const status = useAppStore((state) => state.status);
	const profiles = useAppStore((state) => state.profiles);
	const promises = useAppStore((state) => state.promises);

	// ui states
	const loggedProfile = status ? profiles?.[status.user.id] : undefined;

	return (
		<div
			className={`hidden sm:flex items-center gap-2 p-2 
                absolute top-0 right-0 z-2
                bg-background-a-5 backdrop-blur-3xl rounded-full
                ${status?.isLoggedIn !== true ? "border-awaiting" : ""}`}
		>
			{promises.refresh === "pending" ? (
				<Spinner />
			) : (
				<nav className="flex gap-1 items-center">
					{status ? (
						<Tooltip
							text="Go to your profile"
							direction="left"
						>
							<LinkButton
								href="/profile"
								style={
									loggedProfile?.profile.color
										? {
												outline: `1px solid ${loggedProfile?.profile.color}`,
											}
										: {}
								}
                                className='gap-2!'
							>
								{status && profiles?.[status.user.id] && (
									<ProfileImage
										profile={profiles[status.user.id].profile}
										width={16}
										height={16}
										className="w-6 aspect-square"
									/>
								)}
								{loggedProfile?.user.username ?? "Account"}
							</LinkButton>
						</Tooltip>
					) : (
						<>
							<LinkButton href="/register">
								<Image width={16} height={16} alt="" src="/plus.svg" />
								Sign up
							</LinkButton>
							<LinkButton href="/login">
								<Image width={16} height={16} alt="" src="/auth.svg" />
								Log in
							</LinkButton>
						</>
					)}
				</nav>
			)}
		</div>
	);
};
