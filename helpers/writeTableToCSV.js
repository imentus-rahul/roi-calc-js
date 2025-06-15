import fs from 'fs';

// Function to write table data to a CSV file
export function writeTableToCSV(tableData, fileName) {
    if (tableData.length === 0) {
        console.log('No data to write.');
        return;
    }

    // Extract headers from the first row of tableData
    const headers = Object.keys(tableData[0]);

    // Create an array of arrays, where each inner array represents a row of data
    const csvData = tableData.map(row => headers.map(header => row[header]));

    // Prepend the headers as the first row
    csvData.unshift(headers);

    // Convert the data to CSV format
    const csvContent = csvData.map(row => row.join(',')).join('\n');

    fs.writeFileSync(`./outputs/${fileName}.csv`, csvContent);
    console.log('\nCSV file written successfully.');
}