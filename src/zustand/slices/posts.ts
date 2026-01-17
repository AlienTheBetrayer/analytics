import { PostStore } from "@/types/zustand/posts";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const PostSlice: SliceFunction<PostStore> = (set, get) => {
    return {
        posts: {},
    }
}