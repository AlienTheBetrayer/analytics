export const LoadingSearch = () => {
    return (
        <div className="flex flex-col gap-4">
            {Array.from({ length: 4 }, (v, k) => (
                <div
                    className="flex flex-col w-full h-48 loading rounded-[10vw]!"
                    key={k}
                >
                    <ul className="flex flex-col grow p-4! gap-2 w-full items-center">
                        <li className="flex flex-col items-center w-full">
                            <div className="loading w-full max-w-24 h-6 loading" />
                        </li>

                        <li className="flex flex-col w-full max-w-36">
                            <div className="loading w-full aspect-square rounded-full!" />
                        </li>

                        <li className="flex flex-col w-full">
                            <ul className="flex gap-4 w-full justify-center">
                                <li className="loading w-full max-w-20 h-6 loading" />
                                <li className="loading w-full max-w-20 h-6 loading" />
                            </ul>
                        </li>
                    </ul>
                </div>
            ))}
        </div>
    );
};
