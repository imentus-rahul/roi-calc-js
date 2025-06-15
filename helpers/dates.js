// Example function to add months to a date
export function addMonths(date, months) {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + months);
    return newDate;
}

// Example function to format a date to YYYY-MM-DD
export function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Utility function to format a date to 'MMM-YYYY'
export function formatMonthYear(date) {
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
}

export function getMonthYearFromStart(startDate, monthOffset) {
    const [year, month, day] = startDate.split(/[-/]/).map(Number);
    const start = new Date(year, month - 1, day);
    const resultDate = new Date(start.setMonth(start.getMonth() + monthOffset - 1));
    return resultDate.toLocaleString('default', { month: 'short', year: 'numeric' });
}

export default { addMonths, formatDate, formatMonthYear, getMonthYearFromStart };