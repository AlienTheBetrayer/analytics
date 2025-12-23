import type { PromiseStatus } from "../hooks/usePromiseStatus";

type PromiseStatusCallback<T> = () => Promise<T>;
type PromiseStatusSetter = (key: string, status: PromiseStatus) => void;

/**
 * Runs the asynchronous function and gets its response and stores the status in the state (primarily used in Zustand)
 * @param key a unique id for the promise
 * @param callback the function that'll get captured
 * @param setter a setter function that sets the zustand promise status
 */
export const promiseStatus = async <T>(
	key: string,
	callback: PromiseStatusCallback<T>,
	setter: PromiseStatusSetter,
) => {
	setter(key, "pending");
	try {
		const res = await callback();
		setter(key, "resolved");
		return res;
	} catch (e) {
		setter(key, "rejected");
		throw e;
	}
};
