import Image from "next/image";
import { Spinner } from "@/features/spinner/components/Spinner";
import type { PromiseStatus } from "@/hooks/usePromiseStatus";

export const promiseStatus = (status: PromiseStatus) => {
	switch (status) {
		case "pending":
			return <Spinner />;
		case "rejected":
			return <Image width={16} height={16} alt="error" src="/cross.svg" />;
		case "resolved":
			return <Image width={12} height={12} alt="success" src="/checkmark.svg"/>;
	}
};
