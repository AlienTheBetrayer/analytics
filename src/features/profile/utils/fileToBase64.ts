/**
 * converts a File object to a base-64 string
 * @param file the File object
 * @returns base-64 version of the file
 */
export const fileToBase64 = async (file: File) => {
	return new Promise<string>((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(file);
		reader.onload = () => resolve(reader.result as string);
		reader.onerror = (err) => reject(err);
	});
};
