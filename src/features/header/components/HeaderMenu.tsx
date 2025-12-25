import Image from "next/image";
import { Button } from "@/features/ui/button/components/Button";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { useAppStore } from "@/zustand/store";

type Props = {
	onInteract: () => void;
};

export const HeaderMenu = ({ onInteract }: Props) => {
	// zustand
	const status = useAppStore((state) => state.status);

	return (
		// biome-ignore lint/a11y/useKeyWithClickEvents: <when we click on anything the menu has to go away>
		<ul
			className="flex md:hidden flex-col justify-between w-full h-full p-8!"
			onClick={onInteract}
		>
			<div className="flex flex-col gap-4">
				<li>
					<LinkButton href="/home" style="button" className="p-4! text-5!">
						<Image src="/cube.svg" width={24} height={24} alt="" />
						Home
					</LinkButton>
				</li>
				<li>
					<LinkButton href="/dashboard" style="button" className="p-4! text-5!">
						<Image src="/dashboard.svg" width={24} height={24} alt="" />
						Dashboard
					</LinkButton>
				</li>
			</div>

			<div className="flex flex-col gap-4">
				<li>
					<LinkButton
						href="/register"
						style="button"
						className={`p-4! text-5! ${status?.isLoggedIn === false ? "border-awaiting" : ""}`}
					>
						<Image src="/plus.svg" width={24} height={24} alt="" />
						Register
					</LinkButton>
				</li>
				<li>
					<LinkButton
						href="/login"
						style="button"
						className={`p-4! text-5! ${status?.isLoggedIn === false ? "border-awaiting" : ""}`}
					>
						<Image src="/auth.svg" width={24} height={24} alt="" />
						Log in
					</LinkButton>
				</li>
			</div>

			<div className="flex flex-col gap-4">
				<li>
					<Button className="p-4! text-5! w-full">
						<Image src="/cross.svg" width={24} height={24} alt="" />
						Hide
					</Button>
				</li>
			</div>
		</ul>
	);
};
