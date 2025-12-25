"use client";

import Image from "next/image";
import { Tooltip } from "@/features/tooltip/components/Tooltip";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";
import { Spinner } from "../../spinner/components/Spinner";
import { Button } from "../../ui/button/components/Button";

export const AuthenticationToolbox = () => {
	// zustand
	const logout = useAppStore((state) => state.logout);
	const status = useAppStore((state) => state.status);
	const authenticationPromises = useAppStore(
		(state) => state.authenticationPromises,
	);

	return (
		<div
			className={`hidden! md:flex! flex-row! gap-4 box p-2
        fixed top-4 right-4 items-center z-2 ${status?.isLoggedIn !== true ? "border-awaiting" : ""}`}
		>
			<Image src="/auth.svg" alt="" width={20} height={20} />
			{status === null ? (
				<Spinner />
			) : (
				<nav className="flex gap-1 items-center">
					{status.isLoggedIn === true ? (
						<Tooltip
							description="Go to your profile"
							direction="left"
							inverted={true}
							element={
								<Button
									onClick={() => {
										logout();
									}}
								>
									{authenticationPromises?.logout === "pending" && <Spinner />}
									<Image width={16} height={16} alt="" src="/cross.svg" />
									Log out
								</Button>
							}
						>
							<LinkButton href="/profile">
								<Image width={16} height={16} alt="" src="/account.svg" />
								Profile
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
