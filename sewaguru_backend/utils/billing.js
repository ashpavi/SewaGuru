export const calculateNextBillingDate = (currentDate, interval) => {
    const nextDate = new Date(currentDate);
    if (interval === 'monthly') {
        nextDate.setMonth(nextDate.getMonth() + 1);
    }
    // Add other interval logic if needed
    return nextDate;
};