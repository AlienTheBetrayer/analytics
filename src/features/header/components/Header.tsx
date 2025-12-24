"use client";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useAppStore } from "@/zustand/store";
import { Button } from "../../ui/button/components/Button";
import { LinkButton } from "../../ui/linkbutton/components/LinkButton";
import { HeaderMenu } from "./HeaderMenu";

export const Header = () => {
	// zustand
	const status = useAppStore((state) => state.status);

	// next.js
	const pathName = usePathname();

	// ui states
	const isBorderAwaiting =
		status?.isLoggedIn === false && pathName.startsWith("/dashboard");

	// react states
	const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

	return (
		<header
			style={{
				maxWidth: isMenuOpen ? "100%" : "20rem",
				minHeight: isMenuOpen ? "100vh" : "3rem",
                height: isMenuOpen ? '100vh' : 'auto',
				backdropFilter: `blur(${isMenuOpen ? "1rem" : "4px"})`,
				top: isMenuOpen ? "0rem" : "1rem",
			}}
			className="fixed flex items-center left-1/2 -translate-x-1/2 
            box border-0! w-full z-3 duration-500 transition-all"
		>
			<nav className="flex items-center w-full h-full">
				{!isMenuOpen ? (
					<ul className="flex justify-between gap-4 w-full *:flex *:items-center p-2 px-4">
						<li>
							<LinkButton href="/home" style="link">
								<Image
									src="home.svg"
									width={18}
									height={18}
									alt=""
									className="group-hover:invert-100!"
								/>
								Home
							</LinkButton>
						</li>

						<li className="hidden! md:block!">
							<LinkButton href="/info" style="link">
								<Image
									width={18}
									height={18}
									src="cube.svg"
									alt=""
									className="group-hover:invert-100!"
								/>
								Info
							</LinkButton>
						</li>

						<li className="hidden! md:block!">
							<LinkButton href="/dashboard" style="link">
								<Image
									width={18}
									height={18}
									src="launch.svg"
									alt=""
									className="group-hover:invert-100!"
								/>
								Dashboard
							</LinkButton>
						</li>

						<li className="flex md:hidden">
							<Button
								styles="link"
								className={`${isBorderAwaiting ? "border-awaiting" : ""}`}
								onClick={() => {
									setIsMenuOpen(true);
								}}
							>
								<Image
									width={18}
									height={18}
									src="menu.svg"
									alt=""
									className="group-hover:invert-100!"
								/>
								Menu
							</Button>
						</li>
					</ul>
				) : (
					<HeaderMenu
						onInteract={() => {
							setIsMenuOpen(false);
						}}
						isBorderAwaiting={isBorderAwaiting}
					/>
				)}
			</nav>
		</header>
	);
};
