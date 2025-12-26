import { Spinner } from "@/features/spinner/components/Spinner";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { useAppStore } from "@/zustand/store";
import Image from "next/image";

type Props = {
	data: { profile: Profile; user: User };
};

export const Security = ({ data }: Props) => {
    // zustand
    const authenticationPromises = useAppStore(state => state.authenticationPromises);
    
	return (
		<div className="flex flex-col gap-4 p-2 w-full">
			<div className="flex flex-col gap-2 items-center">
				<span className="text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
				<span>Editing</span>
			</div>

			<hr />
			<div className="flex flex-col sm:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 sm:w-80">
					<div className="bg-blue-3 rounded-full w-full max-w-48 aspect-square" />
					<span className="text-foreground-5!">
						{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
					</span>
				</div>

				<hr className="sm:w-px! sm:h-full" />
				<form
					className="flex flex-col gap-2 w-full"
					onSubmit={(e) => {
						e.preventDefault();
						setProfileData(data.user, { status, bio, oneliner });
					}}
				>
					<label htmlFor="bio" className="flex justify-between">
						One-liner
						<small> (a short phrase that feels yours)</small>
					</label>
					<Input
						value={oneliner}
						onChange={(e) => setOneliner(e)}
						placeholder="24 characters max"
						maxLength={24}
					/>

					<hr className="mt-auto" />
					<Button type="submit">
						{profilePromises?.profile_set === "pending" && <Spinner />}
						<Image src="/send.svg" width={20} height={20} alt="" />
						Apply changes
					</Button>
				</form>
			</div>
		</div>
	);
};
