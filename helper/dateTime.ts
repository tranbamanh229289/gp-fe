// input second (fetch backend)
export const formatDate = (date: number) => {
    return new Date(date * 1000).toLocaleDateString("en-US", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

// input time (fetch backend)
export const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleDateString("en-US", {
        timeZone: "UTC",
        year: "numeric",
        month: "short",
        day: "numeric",
    });
};

// input second (check)
export const isExpired = (date: number) => {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    return date < nowInSeconds;
};

// input second (input fe)
export const timestampToDateInput = (
    timestamp: number | null | undefined,
): string => {
    if (!timestamp) return "";

    return new Date(timestamp * 1000).toISOString().split("T")[0];
};

// input date string(input fe)
export const dateInputToTimestamp = (dateString: string): number | null => {
    if (!dateString) return null;

    return Math.floor(new Date(dateString + "T00:00:00Z").getTime() / 1000);
};
