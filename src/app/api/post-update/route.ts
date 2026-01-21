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
        const { user_id, id, image, image_name, image_type, ...rest } =
            await request.json();

        tokenVerify(request, [user_id]);

        // deleting the old image from the storage if we're editing the image
        if (id && (image || image === null)) {
            const { data, error: existingError } = (await supabaseServer
                .from("posts")
                .select()
                .eq("id", id)) as {
                data: Post[];
                error: PostgrestError | null;
            };

            if (existingError) {
                console.error(existingError);
                return nextResponse(existingError, 400);
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

        // uploading the post along with its image
        const { error } = await supabaseServer
            .from("posts")
            .upsert({ id, user_id, ...rest }, { onConflict: "id" });

        if (error) {
            console.error(error);
            return nextResponse(error, 400);
        }

        return nextResponse(
            { message: "Successfully edited or created a post!" },
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
