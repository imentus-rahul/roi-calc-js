const fs = require('fs');

// // brute - force approach to check on every value
// function calculateCompoundInterestRate(principal, actualFutureValue, nper, annualPayment) {
//     let rate = 0.27; // Starting with a small rate (1%)
//     const maxIterations = 10_00_000;
//     const tolerance = 0.0000001;

//     for (let i = 0; i < maxIterations; i++) {
//         let calculatedFutureValue = principal;
//         let totalPayment = 0;

//         for (let year = 1; year <= nper; year++) {
//             totalPayment += annualPayment;
//             calculatedFutureValue += annualPayment;
//             calculatedFutureValue += calculatedFutureValue * rate;
//         }

//         console.log("🚀 ~ file: index.js:8 ~ calculateCompoundInterestRate ~ futureValue:", calculatedFutureValue);
//         if (Math.abs(calculatedFutureValue - actualFutureValue) < 1) {
//             console.log("🚀 ~ file: index.js:19 ~ calculateCompoundInterestRate ~ rate * 100:", rate * 100);
//             return rate * 100; // Convert rate to percentage
//         }

//         rate += tolerance;
//     }

//     return "Rate not found in a reasonable range.";
// }

// // binary search-like approach to narrow down the rate
function calculateCompoundInterestRate(principal, actualFutureValue, nper, annualPayment, number_of_years_recursive_payment_made) {
    let lowerRateBound = 0;
    let upperRateBound = 1;

    for (let i = 0; i < 100; i++) { // Limit iterations to avoid infinite loop
        const rateGuess = (lowerRateBound + upperRateBound) / 2;
        console.log("🚀 ~ file: index.js:34 ~ calculateCompoundInterestRate ~ rateGuess:", rateGuess);

        let calculatedFutureValue = principal;
        for (let year = 1; year <= nper; year++) {
            let recursive_annual_principle_paid = annualPayment; // cloning in other variable, so that it can be reused in nested for loops
            if (year > number_of_years_recursive_payment_made) {
                recursive_annual_principle_paid = 0;
            }
            calculatedFutureValue += recursive_annual_principle_paid;
            calculatedFutureValue += calculatedFutureValue * rateGuess;
        }

        console.log(`🚀 ~ file: index.js:45 ~ calculateCompoundInterestRate ~ calculatedFutureValue: ${calculatedFutureValue}, at iteration i: ${i} `);
        // 0.000_015_951_693_058_013_916
        // // JS supports 0.07_316_344_472_776_207 (18 decimals)
        // // 20000000.000_000_004 // 20000000.000_000_01 // .000_000_011_175_870_895_385_742 // .toFixed(9) should be placed on OUTPUT when comparing
        if (Math.abs(calculatedFutureValue - actualFutureValue) == 0 || (Math.abs(calculatedFutureValue - actualFutureValue)).toFixed(9) <= 0.000_000_011) { // TODO: check logic here, so that sum should always be greater then or equal to fv and less then (fv+0.000_000_010) difference
            return rateGuess * 100; // Convert rate to percentage
        }
        // // 100% accuracy isn't possible without BN as JS supports 0.07_316_344_472_776_207 (18 decimals) // It will consume all your 100 iterations without providing results
        // if (Math.abs(calculatedFutureValue - actualFutureValue) == 0) {
        //     return rateGuess * 100; // Convert rate to percentage
        // }

        if (calculatedFutureValue < actualFutureValue) {
            lowerRateBound = rateGuess;
        } else {
            upperRateBound = rateGuess;
        }
    }

    return "Rate not found in a reasonable range.";
}

function calculateYearlyInterestChart(principal, annualPayment, rate, years, fv, number_of_years_recursive_payment_made) {
    const tableData = [];
    let totalPrincipal = principal;
    let totalInterest = 0;
    let totalRecursivePayments = 0;

    for (let year = 1; year <= years; year++) {

        if (year > number_of_years_recursive_payment_made) {
            annualPayment = 0; // no nested for loop here, therefore used same variable
        }
        const principalYear = totalPrincipal + annualPayment;
        const interestYear = principalYear * (rate / 100); // Simple Interest
        const interestForThisYearAddOn = annualPayment * (rate / 100); // Simple Interest // TODO: update naming convention

        const yearlyContribution = annualPayment + interestYear;

        totalPrincipal = principalYear + interestYear;
        totalInterest += interestYear;
        totalRecursivePayments += annualPayment;

        let contributionInFV = annualPayment * Math.pow((1 + rate / 100), 1 * ((years - year) + 1)); // By Compound Interest // A = P * (1+(r/n))^nt // calc P, Interest
        let contributionOfPrincipleInFV = annualPayment;
        let contributionOfInterestInFV = annualPayment>0?contributionInFV-annualPayment:0;
        let simpleInterestRate = (contributionInFV - annualPayment) / (annualPayment * ((years - year) + 1)); // Simple Interest Rate // A = P (1 + R * T) = P + PRT // R = (A-P)/(P*T)

        tableData.push({
            Year: year,
            "Recursive Principle": annualPayment.toFixed(2), // // principle added this year externally
            "Cumulative Principle": principalYear.toFixed(2), // // Overall principal that will be used in current year interest calculation
            "Annual Compounded ROI (%)": rate.toFixed(2),
            "Interest on Recursive Principle": interestForThisYearAddOn.toFixed(2), // // interest earned this year on the principle added externally
            "Cumulative Interest": interestYear.toFixed(2),
            "Yearly Contribution Amount": yearlyContribution.toFixed(2),
            "Accumulated Annual Principle Payments since Inception": totalRecursivePayments.toFixed(2),
            "Total Interest Earned (Including Compounding) since Inception": totalInterest.toFixed(2),
            "Contribution of Yearly Contribution Amount in total FV (Value)": contributionInFV.toFixed(2), // // Contribution of current payment in overall FV 
            "Contribution of Yearly Contribution Amount in total FV (%)": ((contributionInFV / fv) * 100).toFixed(7),
            "Contribution of Yearly Contributed Principle in total FV (Value)": contributionOfPrincipleInFV.toFixed(2), // // Contribution of current payment in overall FV 
            "Contribution of Yearly Contributed Principle in total FV (%)": ((contributionOfPrincipleInFV / fv) * 100).toFixed(7),
            "Contribution of Yearly Contributed Interest in total FV (Value)": contributionOfInterestInFV.toFixed(2), // // Contribution of current payment in overall FV 
            "Contribution of Yearly Contributed Interest in total FV (%)": ((contributionOfInterestInFV / fv) * 100).toFixed(7),
            "Annual simpleInterest ROI (%)": (simpleInterestRate * 100).toFixed(7),
        });
        // // TODO: add few more fields in table

    }

    return { tableData: tableData };
}

// Function to write table data to a CSV file
function writeTableToCSV(tableData) {
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

    fs.writeFileSync('./outputs/output.csv', csvContent);
    console.log('\nCSV file written successfully.');
}

function main() {
    // Input values
    const principal = 0; // Initial investment (assuming you start from scratch)
    const fv = 2_00_00_000; // Desired future lump sum
    const nper = 61; // Number of years for maturity
    const annualPayment = 28_722 // 22_969; // 61 Yr // 28_722; // 36 Yr // 51_479; // 15 Yr // 58_554; // 10 Yr // 1_05_008; // 5 Yr // 6_94_123; // 1 Yr // Annual payment // Recursive Payment
    const number_of_years_recursive_payment_made = 36; // TODO: Replace with array of payments, to make this script more generic for lot other , length of this array == nper

    // Calculate the compound interest rate
    const compoundInterestRate = calculateCompoundInterestRate(
        principal,
        fv,
        nper,
        annualPayment,
        number_of_years_recursive_payment_made
    );

    if (!isNaN(compoundInterestRate)) {
        console.log("\nCompound Interest Rate (r): " + compoundInterestRate + " => " + compoundInterestRate.toFixed(2) + "%");
    } else {
        console.log("\nRate not found in a reasonable range, even after 100 iterations.");
    }

    // Calculate yearly interest and contributions chart
    const { tableData } = calculateYearlyInterestChart(
        principal,
        annualPayment,
        compoundInterestRate,
        nper,
        fv,
        number_of_years_recursive_payment_made
    );
    console.table(tableData);
    // console.log(tableData);

    // VERIFY TABLE: fv == SUM(tableData["Contribution in FV (Value)"])
    let total_sum = 0;
    tableData.map((element) => {
        total_sum += parseFloat(element["Contribution of Yearly Contribution Amount in total FV (Value)"]);
    })
    console.log("🚀 ~ file: index.js:140 ~ tableData.map ~ total_sum:", total_sum, "verification status: ", total_sum == fv || (total_sum - fv >= -1 && total_sum - fv < 1)); // TODO: 73_658_514.49->20000000.00999999 do verification by summation of contribution of yearly contribution amount in Total FV == FV

    // write the table data to a CSV file
    writeTableToCSV(tableData);
}

main()
// 61 Yr: 6.85%
// 36 Yr: 6.54%
// 15 Yr: 6.15%
// 10 Yr: 6.42%
// 5 Yr: 6.36%
// 1 Yr: 5.66%