import type { NextRequest } from "next/server";

export const proxy = async (request: NextRequest) => {
    console.log(`REQUEST IS HERE`, request.url);
};
