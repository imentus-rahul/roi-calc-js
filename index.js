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
function calculateCompoundInterestRate(principal, actualFutureValue, nper, annualPayment) {
    let lowerRateBound = 0;
    let upperRateBound = 1;

    for (let i = 0; i < 100; i++) { // Limit iterations to avoid infinite loop
        const rateGuess = (lowerRateBound + upperRateBound) / 2;
        console.log("🚀 ~ file: index.js:34 ~ calculateCompoundInterestRate ~ rateGuess:", rateGuess);

        let calculatedFutureValue = principal;
        for (let year = 1; year <= nper; year++) {
            calculatedFutureValue += annualPayment;
            calculatedFutureValue += calculatedFutureValue * rateGuess;
        }

        console.log(`🚀 ~ file: index.js:45 ~ calculateCompoundInterestRate ~ calculatedFutureValue: ${calculatedFutureValue}, at iteration i: ${i} `);
        // // JS supports 0.07_316_344_472_776_207 (18 decimals)
        // // 20000000.000_000_004
        if (Math.abs(calculatedFutureValue - actualFutureValue) == 0 || Math.abs(calculatedFutureValue - actualFutureValue) < 0.000_000_010) {
            return rateGuess * 100; // Convert rate to percentage
        }
        // // 100% accuracy isn't possible without BN as JS supports 0.07_316_344_472_776_207 (18 decimals)
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

function calculateYearlyInterestChart(principal, annualPayment, rate, years, fv) {
    const tableData = [];
    let totalPrincipal = principal;
    let totalInterest = 0;
    let totalRecursivePayments = 0;

    for (let year = 1; year <= years; year++) {

        const principalYear = totalPrincipal + annualPayment;
        const interestYear = principalYear * (rate / 100); // Simple Interest

        const yearlyContribution = annualPayment + interestYear;

        totalPrincipal = principalYear + interestYear;
        totalInterest += interestYear;
        totalRecursivePayments += annualPayment;

        let contributionInFV = annualPayment * Math.pow((1 + rate / 100), 1 * ((years - year) + 1)); // By Compound Interest
        let simpleInterestRate = (contributionInFV-annualPayment) / (annualPayment * ((years - year) + 1)); // Simple Interest Rate // A = P (1 + R * T) = P + PRT // R = (A-P)/(P*T)

        tableData.push({
            Year: year,
            "Cumulative Principle": principalYear.toFixed(2), // // Overall principal that will be used in current year interest calculation
            "Annual Compounded ROI (%)": rate.toFixed(2),
            "Cumulative Interest": interestYear.toFixed(2),
            "Yearly Contribution": yearlyContribution.toFixed(2),
            "Total Annual Payments": totalRecursivePayments.toFixed(2),
            "Total Interest": totalInterest.toFixed(2),
            "Contribution in FV (Value)": contributionInFV.toFixed(2), // // Contribution of current payment in overall FV 
            "Contribution in FV (%)": ((contributionInFV / fv) * 100).toFixed(7),
            "Annual simpleInterest ROI (%)": (simpleInterestRate * 100).toFixed(7),
        });

    }

    return { tableData: tableData };
}


function main() {
    // Input values
    const principal = 0; // Initial investment (assuming you start from scratch)
    const fv = 2_00_00_000; // Desired future lump sum
    const nper = 61; // Number of years
    const annualPayment = 22_969; // Annual payment

    // Calculate the compound interest rate
    const compoundInterestRate = calculateCompoundInterestRate(
        principal,
        fv,
        nper,
        annualPayment
    );

    if (!isNaN(compoundInterestRate)) {
        console.log("\nCompound Interest Rate (r): " + compoundInterestRate + " => " + compoundInterestRate.toFixed(2) + "%");
    } else {
        console.log("Rate not found in a reasonable range.");
    }

    // Calculate yearly interest and contributions chart
    const { tableData } = calculateYearlyInterestChart(
        principal,
        annualPayment,
        compoundInterestRate,
        nper,
        fv
    );
    console.table(tableData);
    // console.log(tableData);

    // // check fv == SUM(tableData["Contribution in FV (Value)"])
    // let total_sum = 0;
    // tableData.map((element)=>{
    //     total_sum += parseFloat(element["Contribution in FV (Value)"]);
    // })
    // console.log("🚀 ~ file: index.js:140 ~ tableData.map ~ total_sum:", total_sum);
}

main()
