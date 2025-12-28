import "./Edit.css";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";
import { promiseStatus } from "@/utils/status";
import { useAppStore } from "@/zustand/store";

type Props = {
	data: { profile: Profile; user: User };
};

export const Edit = ({ data }: Props) => {
	// zustand state
	const promises = useAppStore((state) => state.promises);

	// zustand functions
	const setProfileData = useAppStore((state) => state.setProfileData);

	// input states
	const [status, setStatus] = useState<string>(data.profile.status ?? "");
	const [name, setName] = useState<string>(data.profile.name ?? "");
	const [bio, setBio] = useState<string>(data.profile.bio ?? "");
	const [oneliner, setOneliner] = useState<string>(data.profile.oneliner ?? "");
	const [color, setColor] = useState<string>(data.profile.color ?? "#000");
    console.log(color);

	return (
		<div className="flex flex-col gap-4 p-2 w-full">
			<div className="flex flex-col gap-2 items-center">
				<span className="text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
				<span>Appearance editing</span>
			</div>

			<hr />
			<div className="flex flex-col sm:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 sm:w-80">
					<span>{data.profile.name}</span>
					<div className="bg-blue-3 rounded-full w-full max-w-48 aspect-square" />
					<span className="text-foreground-5!">
						{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
					</span>
					<label
						htmlFor="profile-color"
						className="flex justify-between items-center w-full"
					>
						Color
						<small> (everyone will see it)</small>
					</label>
					<input
						value={color}
						onChange={(e) => setColor(e.target.value)}
						id="profile-color"
						type="color"
						className="cursor-pointer w-full! h-12 outline-0"
					/>
				</div>

				<hr className="sm:w-px! sm:h-full" />
				<form
					className="flex flex-col gap-2 w-full"
					onSubmit={(e) => {
						e.preventDefault();
						setProfileData(data.user, { status, bio, oneliner, name, color });
					}}
				>
					<label htmlFor="bio" className="flex justify-between items-center">
						<b>Name</b>
						<small> (your name, can be fictional)</small>
					</label>
					<Input
						value={name}
						onChange={(e) => setName(e)}
						placeholder="24 characters max"
						maxLength={24}
					/>

					<hr />
					<label htmlFor="bio" className="flex justify-between items-center">
						<b>One-liner</b>
						<small> (a short phrase that feels yours)</small>
					</label>
					<Input
						value={oneliner}
						onChange={(e) => setOneliner(e)}
						placeholder="24 characters max"
						maxLength={24}
					/>

					<hr />
					<label htmlFor="status" className="flex justify-between items-center">
						<b>Status</b>
						<small> (a short text capturing your mood)</small>
					</label>
					<Input
						id="status"
						value={status}
						onChange={(e) => setStatus(e)}
						maxLength={48}
						placeholder="48 characters max"
					/>

					<hr />
					<label htmlFor="bio" className="flex justify-between items-center">
						<b>Bio</b>
						<small> (a long piece of text, describe yourself)</small>
					</label>
					<Input
						value={bio}
						onChange={(e) => setBio(e)}
						placeholder="128 characters max"
						maxLength={128}
					/>

					<hr className="mt-auto" />
					<Button type="submit">
						{promiseStatus(promises.profile_set)}
						<Image src="/send.svg" width={20} height={20} alt="" />
						Apply changes
					</Button>
				</form>
			</div>
		</div>
	);
};
