import { NoContent } from "@/features/posts/components/parts/errors/NoContent";
import { ToplineExpanded } from "@/features/posts/components/parts/expanded/ToplineExpanded";
import { AbsentTopline } from "@/features/ui/loading/components/AbsentTopline";
import { LoadingEmulate } from "@/features/ui/loading/components/LoadingEmulate";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    id: string;
};

export const PostExpanded = ({ id }: Props) => {
    const { data, isLoading } = useQuery({ key: ["post", id] });

    if (isLoading) {
        return (
            <>
                <AbsentTopline
                    title="Loading..."
                    className="max-w-400!"
                />

                <div
                    className={`box max-w-400 w-full mx-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingEmulate />
                </div>
            </>
        );
    }

    if (!data) {
        return (
            <>
                <AbsentTopline
                    title="Data is absent"
                    className="max-w-400!"
                />

                <div
                    className={`box max-w-400 w-full mx-auto min-h-128 rounded-4xl! overflow-hidden`}
                >
                    <LoadingEmulate />
                </div>
            </>
        );
    }

    // main jsx
    return (
        <article
            className={`flex flex-col rounded-4xl! overflow-hidden min-h-128! relative
        ${data.image_url ? "" : "border border-background-a-5"}`}
        >
            <ToplineExpanded
                data={data}
                className="overflow-hidden!"
            />

            <ul className="flex flex-col gap-4">
                {data.image_url && (
                    <>
                        <li className="w-full relative h-150">
                            <Image
                                alt="post image"
                                fill
                                src={data.image_url}
                                style={{ objectFit: "cover" }}
                                className="invert-0! rounded-4xl"
                            />
                        </li>

                        <li>
                            <hr />
                        </li>
                    </>
                )}

                <li
                    className="flex flex-col gap-4"
                    style={{
                        marginTop: data.image_url ? "0rem" : "8rem",
                    }}
                >
                    <div className="flex justify-center items-center gap-1">
                        <Image
                            alt=""
                            width={16}
                            height={16}
                            src="/menu.svg"
                        />
                        <span>Content:</span>
                    </div>

                    <div className="box p-4! min-h-64">
                        {data.content?.trim().length ? (
                            <p>{data.content}</p>
                        ) : (
                            <NoContent data={data} />
                        )}
                    </div>
                </li>
            </ul>
        </article>
    );
};
