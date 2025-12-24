"use client";

import Image from "next/image";
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
			className={`hidden md:flex gap-4 box p-2
        fixed top-4 right-4 items-center z-2 ${status !== null && status?.isLoggedIn !== true ? "border-awaiting" : ""}`}
		>
			<Image
				src="auth.svg"
				alt=""
				width={20}
				height={20}
			/>
			{status === null ? (
				<Spinner />
			) : (
				<nav className="flex gap-1 items-center">
					{status.isLoggedIn === true ? (
						<Button
							onClick={() => {
								logout();
							}}
						>
							{authenticationPromises?.logout === "pending" && <Spinner />}
							Log out
						</Button>
					) : (
						<>
							<LinkButton href="/register">Register</LinkButton>
							<LinkButton href="/login">Log in</LinkButton>
						</>
					)}
				</nav>
			)}
		</div>
	);
};
