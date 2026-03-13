import { CountAllTablesEntries } from "@/app/api/get/count-all-tables/route";
import { CacheAPIFunctions } from "@/query-api/protocol";
import axios from "axios";

export type CacheAPIProtocolOther = {
    countAllTables: {
        key: ["count-all-tables"];
        data: { table: (typeof CountAllTablesEntries)[number]; count: number }[];
    };
};

export const CacheAPIFunctionsOther: CacheAPIFunctions<CacheAPIProtocolOther> = {
    countAllTables: async () => {
        return (await axios.get("/api/get/count-all-tables")).data.count;
    },
};
