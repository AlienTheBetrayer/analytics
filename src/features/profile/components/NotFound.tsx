import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import Image from "next/image";

export const NotFound = () => {
	return (
		<div className="box max-w-lg w-full m-auto">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2">
					<span className="text-center text-foreground-2! text-5!">
						<u>Wrong</u> user!
					</span>
					<span className="text-center">
						The user has either not created a profile yet or they don't exist.
					</span>
				</div>

				<hr />
				<div>
					<LinkButton href="/home">
						<Image width={16} height={16} src="/cube.svg" alt="" />
						Go back home
					</LinkButton>
				</div>
			</div>
		</div>
	);
};
