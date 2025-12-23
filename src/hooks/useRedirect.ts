import { redirect } from "next/navigation";
import { useEffect } from "react";

/**
 * Auto-redirects your page upon trigger (client-side)
 * @param trigger a trigger to determine whether we should redirect or not
 * @param path path to redirect to
 */
export const useRedirect = (trigger: boolean | null | undefined, path: string) => {
	useEffect(() => {
		if (trigger === true) {
			redirect(path);
		}
	}, [trigger, path]);
};
