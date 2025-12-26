import Image from "next/image";
import { useState } from "react";
import { Button } from "@/features/ui/button/components/Button";
import { Input } from "@/features/ui/input/components/Input";
import { Select } from "@/features/ui/select/components/Select";

export const ProfileEdit = () => {
	// input states
	const [status, setStatus] = useState<string>("");
	const [bio, setBio] = useState<string>("");
	const [visibility, setVisibility] = useState<string>("everyone");

	return (
		<div className="flex flex-col w-full gap-4">
			<div className="flex flex-col gap-2">
				<Input
					placeholder="Status"
					value={status}
					onChange={(e) => setStatus(e)}
				/>
				<Input placeholder="Bio" value={bio} onChange={(e) => setBio(e)} />
				<Select
					items={["everyone", "friends", "nobody"]}
					value={visibility}
					onChange={(e) => setVisibility(e)}
				/>
			</div>

			<hr className="mt-auto" />
			<div className="flex flex-col gap-2">
				<Button>
					<Image width={20} height={20} src="/send.svg" alt="" />
					Apply changes
				</Button>
			</div>
		</div>
	);
};
