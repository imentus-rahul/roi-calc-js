import { writeTableToCSV } from './helpers/writeTableToCSV.js';
import { inputsForCalculateCompoundInterestRate } from './services/CAGRBasedOnFutureValue.js';
import { inputsForCalculatePMTforFixedAndReducingEMIs } from './services/PMTforFixedAndReducingEMIs.js';

async function main() {
    let tableData = null;
    let dashboardData = null;
    switch (process.argv[2]) {
        case 'CAGRBasedOnFutureValue':
            tableData = (inputsForCalculateCompoundInterestRate()).tableData;
            // write the table data to a CSV file
            writeTableToCSV(tableData, 'CAGRBasedOnFutureValue');
            break;
        case 'PMTforFixedAndReducingEMIs':
            let results = inputsForCalculatePMTforFixedAndReducingEMIs();
            tableData = results.tableData;
            dashboardData = results.dashboard;
            // write the table data to a CSV file
            writeTableToCSV(tableData, 'PMTforFixedAndReducingEMIs');
            break;
    }

    // console.log("🚀 ~ file: index.js:173 ~ main ~ tableData:", tableData)
    console.log("🚀 ~ file: index.js:173 ~ main ~ dashboardData:", dashboardData)
}

main()
