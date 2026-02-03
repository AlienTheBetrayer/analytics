import { PostStore } from "@/types/zustand/posts";
import { SliceFunction } from "@/types/zustand/utils/sliceFunction";

export const PostSlice: SliceFunction<PostStore> = (set) => {
    return {
        postFiltering: {
            column: undefined,
            filter: "",
        },

        updatePostFiltering: (filtering) => {
            set((state) => ({
                ...state,
                postFiltering: { ...state.postFiltering, ...filtering },
            }));
        },
    };
};
