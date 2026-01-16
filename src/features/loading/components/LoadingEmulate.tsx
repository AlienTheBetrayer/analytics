export const LoadingEmulate = () => {
    return (
        <>
            <div className="w-full flex items-center h-10 px-4 gap-2 my-4">
                <div className="loading w-full max-w-48 h-6 rounded-full!" />

                <div className="loading w-full max-w-16 h-6 rounded-full! ml-auto" />
                <div className="loading w-full max-w-48 h-6 rounded-full!" />
            </div>

            <div className="flex flex-col gap-2 w-full min-h-128">
                <div className="w-full h-10 loading" />
                <div className="w-full h-10 loading" />

                <ul className="flex flex-col gap-2 w-full mt-12!">
                    {Array.from({ length: 8 }, (v, k) => (
                        <li
                            className="w-full h-10 loading rounded-full!"
                            key={k}
                        />
                    ))}
                </ul>
            </div>
        </>
    );
};
