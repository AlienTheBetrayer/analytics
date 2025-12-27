import type { Profile } from "@/types/api/database/profiles";
import type { User } from "@/types/api/database/user";

type Props = {
	data: { profile: Profile; user: User };
};

export const Friends = ({ data }: Props) => {
	return (
		<div className="flex flex-col gap-4 p-2 w-full">
			<div className="flex flex-col gap-2 items-center">
				<span className="text-center text-foreground-2! text-5!">
					<mark>{data.user.username}</mark>
					's profile
				</span>
				<span>Your friends</span>
			</div>

			<hr />
			<div className="flex flex-col sm:flex-row gap-4 grow w-full">
				<div className="flex flex-col items-center gap-2 sm:w-80">
					<div className="bg-blue-3 rounded-full h-48 aspect-square" />
					<span className="text-foreground-5!">
						{data.user.role[0].toUpperCase() + data.user.role.substring(1)}
					</span>
				</div>
				<hr className="sm:w-px! sm:h-full" />

				<div className="flex flex-col gap-2 w-full">
                    <span>
                        <b>Friends</b>
                    </span>
                    <ul className='flex flex-col gap-2'>
                        
                    </ul>
                    <hr/>
                </div>
			</div>
		</div>
	);
};
