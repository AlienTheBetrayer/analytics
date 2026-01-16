export const LoadingNotifications = () => {
    return (
        <>
            <div className="w-full flex items-center h-10 px-4 gap-2 my-4">
                <div className="loading w-full max-w-48 h-6 rounded-full!" />

                <div className="loading w-full max-w-16 h-6 rounded-full! ml-auto" />
                <div className="loading w-full max-w-48 h-6 rounded-full!" />
            </div>

            <div className="w-full grid gap-8 md:grid-cols-2 min-h-128">
                <div className="flex flex-col gap-16 items-center">
                    <div className="w-full h-10 loading" />

                    <ul className="flex flex-col gap-8 w-full">
                        {Array.from({ length: 5 }, (v, k) => (
                            <li
                                className="flex flex-col gap-0.5 w-full"
                                key={k}
                            >
                                <div className="w-full h-10 loading rounded-full! rounded-b-none!" />
                                <div className="w-full h-20 loading rounded-4xl! rounded-t-none!" />
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="flex flex-col gap-16 items-center">
                    <div className="w-full h-10 loading" />

                    <ul className="flex flex-col gap-8 w-full">
                        {Array.from({ length: 5 }, (v, k) => (
                            <li
                                className="flex flex-col gap-0.5 w-full"
                                key={k}
                            >
                                <div className="w-full h-10 loading rounded-full! rounded-b-none!" />
                                <div className="w-full h-20 loading rounded-4xl! rounded-t-none!" />
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
