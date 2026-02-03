export const getPagination = (page: number, size: number) => {
    const from = page ? page * size : 0;
    const to = page ? from + size - 1 : size - 1;

    return { from, to };
};
