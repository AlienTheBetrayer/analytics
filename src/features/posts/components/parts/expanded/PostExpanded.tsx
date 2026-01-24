import { ToplineExpanded } from "@/features/posts/components/parts/expanded/ToplineExpanded";
import { Post } from "@/types/tables/posts";
import Image from "next/image";

type Props = {
    data: Post;
};

export const PostExpanded = ({ data }: Props) => {
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
                        <li className="w-full relative h-128">
                            <Image
                                alt="post image"
                                fill
                                src={data.image_url}
                                style={{ objectFit: "cover" }}
                                className="invert-0!"
                            />
                        </li>

                        <li>
                            <hr />
                        </li>
                    </>
                )}

                <li
                    className="box p-4! min-h-128"
                    style={{
                        marginTop: data.image_url ? "0rem" : "8rem",
                    }}
                >
                    <p>{data.content}</p>
                </li>

                <li>
                    <hr />
                </li>
            </ul>
        </article>
    );
};
