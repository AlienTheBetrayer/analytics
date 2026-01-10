/**
 * capitalizes the string, making it go from "hello" to "Hello"
 */
export const capitalize = (value?: string) => {
    return !value ? undefined : value[0].toUpperCase() + value.substring(1);
};
