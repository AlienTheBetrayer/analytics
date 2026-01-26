import { supabaseServer } from "@/server/private/supabase";
import { Post } from "@/types/tables/posts";
import { nextResponse } from "@/utils/api/response";
import { deleteImage, uploadImage } from "@/utils/api/upload";
import { tokenVerify } from "@/utils/auth/tokenVerify";
import { PostgrestError } from "@supabase/supabase-js";
import { NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
    try {
        // arguments and permissions
        const {
            user_id,
            id,
            image,
            image_name,
            image_type,
            type,
            privacy,
            ...rest
        } = await request.json();

        if (!user_id || !type) {
            console.error("user_id and type are missing");
            return nextResponse({ error: "user_id and type are missing" }, 400);
        }

        tokenVerify(request, [user_id]);

        // type-specific manipulations
        switch (type) {
            case "delete": {
                const { data, error } = (await supabaseServer
                    .from("posts")
                    .delete()
                    .eq("id", id)
                    .select()) as {
                    data: Post[];
                    error: PostgrestError | null;
                };

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                if (data.length > 0 && data[0].image_url) {
                    await deleteImage({
                        user_id,
                        url: data[0].image_url,
                        folder: "posts",
                    });
                }

                return nextResponse(
                    {
                        message:
                            "Successfully deleted the post with its images.",
                        post: data[0],
                    },
                    200,
                );
            }
            case "privacy": {
                if (!privacy) {
                    console.error("privacy is required for [privacy]");
                    return nextResponse(
                        { error: "privacy is required for [privacy]" },
                        400,
                    );
                }

                const { error } = await supabaseServer
                    .from("post_privacy")
                    .upsert(
                        {
                            post_id: id,
                            edited_at: new Date().toISOString(),
                            ...privacy,
                        },
                        { onConflict: "post_id" },
                    );

                if (error) {
                    console.error(error);
                    return nextResponse({ error }, 400);
                }

                return nextResponse(
                    { message: "Successfully configured post's privacy" },
                    200,
                );
            }
            case "edit": {
                if (!(id && (image || image === null))) {
                    console.error("id and image are required for [edit]");
                    return nextResponse(
                        { error: "id and image are required for [edit]" },
                        400,
                    );
                }

                const { data, error } = (await supabaseServer
                    .from("posts")
                    .select()
                    .eq("id", id)) as {
                    data: Post[];
                    error: PostgrestError | null;
                };

                if (error) {
                    console.error(error);
                    return nextResponse(error, 400);
                }

                if (data.length > 0 && data[0].image_url) {
                    await deleteImage({
                        user_id,
                        url: data[0].image_url,
                        folder: "posts",
                    });
                }

                delete rest.image;
                rest.image_url = null;
                break;
            }
        }

        // uploading the image if we have it in params
        if (image) {
            if (!(image_name && image_type)) {
                console.error("image_name and image_type are undefined");
                return nextResponse({
                    error: "image_name and image_type are undefined",
                });
            }

            const url = await uploadImage({
                user_id,
                base64: image,
                name: image_name,
                type: image_type,
                folder: "posts",
            });

            delete rest.image;
            delete rest.image_name;
            delete rest.image_type;
            rest.image_url = url;
        }

        // uploading the post along with its image (final upload)
        const { data, error } = await supabaseServer
            .from("posts")
            .upsert(
                {
                    id,
                    user_id,
                    ...(type === "edit" && {
                        edited_at: new Date().toISOString(),
                    }),
                    ...rest,
                },
                { onConflict: "id" },
            )
            .select();

        if (error) {
            console.error(error);
            return nextResponse(error, 400);
        }

        return nextResponse(
            {
                message: "Successfully edited or created a post!",
                post: data[0],
            },
            200,
        );
    } catch (error) {
        console.error(error);
        return nextResponse(
            { error: "Failed editing or creating a post." },
            400,
        );
    }
};
