export type CacheAPIProtocolSearch = {
        search: {
        key: ["search", string, number];
        data: {
            ids: { id: string; post_ids: string[] }[];
            pages: number;
        };
    };
}