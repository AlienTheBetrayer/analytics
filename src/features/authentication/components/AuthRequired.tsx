import Image from "next/image";
import { Spinner } from "@/features/spinner/components/Spinner";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";

type Props = {
	description?: string;
};

export const AuthRequired = ({ description }: Props) => {
	return (
		<div className="flex flex-col items-center gap-4">
			<div className="flex flex-col gap-2">
				<span className="text-center">
					{description ?? "Authentication / permissions are required."}
				</span>
				<Spinner styles="big" />
			</div>
			<hr />
			<div className="grid grid-cols-2 w-full gap-2">
				<LinkButton href="/register">
					<Image width={16} height={16} alt="" src="/plus.svg" />
					Register
				</LinkButton>
				<LinkButton href="/login">
					<Image width={16} height={16} alt="" src="/auth.svg" />
					Log in
				</LinkButton>
			</div>
		</div>
	);
};
