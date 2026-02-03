export type PostFilteringColumn = "Liked" | "Edited" | "Raw" | "With Images";
export type PostFiltering = {
    filter: string;
    column: PostFilteringColumn | undefined;
};

export type PostStore = {
    // misc: searching / filtering
    postFiltering: PostFiltering;

    /**
     * updates the filtering metadata
     * @param sorting a partial sorting object
     */
    updatePostFiltering: (sorting: Partial<PostFiltering>) => void;
};
