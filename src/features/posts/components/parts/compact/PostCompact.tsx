import { ToplineCompact } from "@/features/posts/components/parts/compact/ToplineCompact";
import { CompactInfo } from "@/features/posts/components/parts/CompactInfo";
import { LinkButton } from "@/features/ui/linkbutton/components/LinkButton";
import { Tooltip } from "@/features/ui/popovers/components/tooltip/Tooltip";
import { useQuery } from "@/query/core";
import Image from "next/image";

type Props = {
    id: string;
    className?: string;
};

export const PostCompact = ({ id, className }: Props) => {
    // fetching
    const { data, isLoading } = useQuery({ key: ["post", id] });

    if (isLoading) {
        return <article className="w-full h-81 loading" />;
    }

    if (!data) {
        return null;
    }

    // main jsx
    return (
        <article
            className={`flex flex-col rounded-4xl! overflow-hidden h-81 relative
        ${data.image_url ? "" : "border border-background-a-5"}
        ${className ?? ""}`}
            style={{
                maskImage: "radial-gradient(white, black)",
                WebkitMaskImage: "-webkit-radial-gradient(white, black)",
            }}
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

            <ToplineCompact
                data={data}
                type="compact"
            />

            <Tooltip
                direction="middle"
                className="w-full grow"
                element={<CompactInfo post={data} />}
            >
                <LinkButton
                    className={`box rounded-none! backdrop-blur-none! bg-transparent! grow z-1! h-full border-0! outline-0! group
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
            </Tooltip>
        </article>
    );
};
