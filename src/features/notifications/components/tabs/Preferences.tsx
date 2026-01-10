import Image from "next/image";

export const Preferences = () => {
    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col items-center">
                <Image
                    alt=""
                    width={16}
                    height={16}
                    src="/settings.svg"
                    className="invert-60!"
                />
                <span className="text-foreground-5!">Notification preferences</span>
                <hr className="mt-4" />
            </div>
        </div>
    );
};
