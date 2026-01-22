import { Topline } from "@/features/posts/components/parts/Topline";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Post } from "@/types/tables/posts";
import Image from "next/image";

type Props = {
    data: Post;
};

export const PostCompact = ({ data }: Props) => {
    // main jsx
    return (
        <article
            className={`flex flex-col rounded-4xl! overflow-hidden h-36! relative
        ${data.image_url ? "" : "border border-background-a-5"}`}
        >
            {data.image_url && (
                <Image
                    alt="post image"
                    fill
                    src={data.image_url}
                    style={{ objectFit: "cover" }}
                    className="invert-0! aspect-video"
                />
            )}

            <Topline
                data={data}
                className="rounded-none!"
            />

            <LinkButton
                className={`box rounded-none! backdrop-blur-none! grow z-10! border-0! outline-0! group
                    ${data.image_url ? "not-[&:hover]:bg-transparent!" : ""}`}
                style={
                    data.image_url
                        ? ({
                              "--ripple-color": "#00000099",
                          } as React.CSSProperties)
                        : {}
                }
                href={`/post/view/${data.id}`}
            >
                <div
                    className="absolute left-1/2 top-1/2 -translate-1/2 
                    group-hover:scale-150 group-hover:outline-blue-1 group-focus-within:scale-150 group-focus-within:outline-blue-1 duration-400 ease-in-out
                            rounded-full aspect-square p-2 outline-2 outline-blue-3 backdrop-blur-md"
                >
                    <Image
                        alt="open post"
                        width={24}
                        height={24}
                        src="/launch.svg"
                    />
                </div>
            </LinkButton>
        </article>
    );
};
