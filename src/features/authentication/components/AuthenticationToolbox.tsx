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
			className={`hidden! md:flex! flex-row! gap-4 box p-2
        fixed top-4 right-4 items-center z-2 ${status?.isLoggedIn !== true ? "border-awaiting" : ""}`}
		>
			<Image src="/auth.svg" alt="" width={20} height={20} />
			{promises.refresh === "pending" ? (
				<Spinner />
			) : (
				<nav className="flex gap-1 items-center">
					{status ? (
						<Tooltip
							description="Go to your profile"
							direction="left"
							inverted={true}
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
							>
								{status && profiles?.[status.user.id] && (
									<ProfileImage
										profile={profiles[status.user.id].profile}
										width={16}
										height={16}
									/>
								)}
								<Image width={16} height={16} alt="" src="/account.svg" />
								{loggedProfile?.user.username ?? "Account"}
							</LinkButton>
						</Tooltip>
					) : (
						<>
							<LinkButton href="/register">
								<Image width={16} height={16} alt="" src="/plus.svg" />
								Register
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
