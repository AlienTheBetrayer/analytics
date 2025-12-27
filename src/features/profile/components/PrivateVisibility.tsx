import Image from "next/image";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";

export const PrivateVisiblity = () => {
	return (
		<div className="box max-w-lg w-full m-auto">
			<div className="flex flex-col gap-4">
				<div className="flex flex-col gap-2 items-center">
                    <small>

                    <Image width={32} height={32} src="/prohibited.svg" alt=''/>
                    </small>
					<span className="text-center text-foreground-2! text-5!">
						User has a <u>private</u> profile!
					</span>
					<span className="text-center">
						You cannot access this user's profile, at least for now..
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
