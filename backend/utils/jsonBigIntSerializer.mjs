export const jsonBigIntSerializer = (key, value) => {
    return typeof value === "bigint" ? value.toString() : value;
};
