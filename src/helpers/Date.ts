export const formatDate = (date: Date) => {
    return date.toISOString().replace("Z", "").replace("T", " ")
};
