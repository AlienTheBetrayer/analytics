export const dotColors = (data?: Record<string, boolean>) => {
    let hex = "transparent";

    if (data) {
        const values = Object.values(data).reduce(
            (acc, val) => {
                return val
                    ? { ...acc, truthy: acc.truthy + 1 }
                    : { ...acc, falsy: acc.falsy + 1 };
            },
            { falsy: 0, truthy: 0 }
        );

        if (!values.falsy) {
            hex = "var(--blue-1)";
        } else if (!values.truthy) {
            hex = "var(--red-1)";
        } else {
            hex = "var(--orange-1)";
        }
    }

    return hex;
};
