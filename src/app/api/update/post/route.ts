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
            throw "user_id and type are missing";
        }

        tokenVerify({ request, id: [user_id] });

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
                    throw error;
                }

                if (data.length > 0 && data[0].image_url) {
                    await deleteImage({
                        user_id,
                        url: data[0].image_url,
                        folder: "posts",
                    });
                }

                return nextResponse({ success: true }, 200);
            }
            case "privacy": {
                if (!privacy) {
                    throw "privacy is undefined";
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
                    throw error;
                }

                return nextResponse({ success: true }, 200);
            }
            case "edit": {
                if (!id) {
                    throw "id is undefined";
                }

                if(!(image || image === null)) {
                    break;
                }

                const { data, error } = (await supabaseServer
                    .from("posts")
                    .select()
                    .eq("id", id)) as {
                    data: Post[];
                    error: PostgrestError | null;
                };

                if (error) {
                    throw error;
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
                throw "image_name and image_type are undefined";
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
        const { error } = await supabaseServer
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
            throw error;
        }

        return nextResponse({ success: true }, 200);
    } catch (error) {
        console.error(error);
        return nextResponse({ success: false }, 400);
    }
};
