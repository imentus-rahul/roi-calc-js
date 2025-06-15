import Decimal from 'decimal.js';
import { getMonthYearFromStart } from '../helpers/dates.js';


// Amortization Schedule Calculator in JS with dynamic repo rate and part payments support

function calculateAmortizationSchedule(config) {
    const {
        loanAmount,
        annualInterestRate,
        paymentsPerYear,
        termYears,
        startDate,
        repoRateRevisions = {},
        partPayments = {},
        partialEmiPayments = {},
        additionalPrincipalInjections = {},
        fixedEMI = true
    } = config;

    // Function to calculate EMI using standard amortization formula
    function calculateEMI(principal, rate, n) {
        if (rate.eq(0)) return principal.div(n);
        const numerator = principal.mul(rate).mul((Decimal(1).add(rate)).pow(n));
        const denominator = (Decimal(1).add(rate)).pow(n).sub(1);
        return numerator.div(denominator);
    }

    const schedule = [];
    const totalPeriods = termYears * paymentsPerYear;
    let monthNumber = 0;
    let principalOutstanding = new Decimal(loanAmount);
    let currentRate = new Decimal(annualInterestRate);

    // Calculate initial EMI
    const initialRatePerPeriod = currentRate.div(100).div(paymentsPerYear);
    const originalEMI = calculateEMI(new Decimal(loanAmount), initialRatePerPeriod, totalPeriods);
    let emi = fixedEMI ? originalEMI : null;

    // Tracking totals
    let totalInterestPaid = new Decimal(0);
    let totalPrincipalPaid = new Decimal(0);
    let totalEmiOnlyPaid = new Decimal(0);
    let totalPartPaymentPaid = new Decimal(0);

    while (principalOutstanding.gt(0)) {
        monthNumber++;
        const principalOutstandingStart = principalOutstanding;

        // Handle repo rate revision
        if (repoRateRevisions[monthNumber]) {
            const { newRate, updateEMI } = repoRateRevisions[monthNumber];
            currentRate = new Decimal(newRate);
            if (updateEMI && fixedEMI) {
                const updatedRatePerPeriod = currentRate.div(100).div(paymentsPerYear);
                emi = calculateEMI(new Decimal(loanAmount), updatedRatePerPeriod, totalPeriods);
            }
        }

        // Calculate period rate and interest
        const thisMonthRate = currentRate.div(100).div(paymentsPerYear);
        const interestComponent = principalOutstandingStart.mul(thisMonthRate);

        // Calculate EMI based on scheme
        if (!fixedEMI) {
            // For variable EMI (fixed tenure)
            const remainingPeriods = totalPeriods - (monthNumber - 1);
            emi = calculateEMI(principalOutstandingStart, thisMonthRate, remainingPeriods);
        }

        let principalComponent = emi.sub(interestComponent);
        if (principalComponent.gt(principalOutstandingStart)) {
            principalComponent = principalOutstandingStart;
            emi = principalComponent.add(interestComponent);
        }

        // Get payments for this month
        const emiPaid = partialEmiPayments[monthNumber] !== undefined
            ? new Decimal(partialEmiPayments[monthNumber])
            : emi;
        const partPayment = partPayments[monthNumber]
            ? new Decimal(partPayments[monthNumber])
            : new Decimal(0);
        const additionalLoan = additionalPrincipalInjections[monthNumber]
            ? new Decimal(additionalPrincipalInjections[monthNumber])
            : new Decimal(0);

        // Calculate interest and principal paid
        const interestPaid = Decimal.min(emiPaid, interestComponent);
        const unpaidInterest = interestComponent.sub(interestPaid);
        const principalPaidFromEMI = emiPaid.gt(interestPaid)
            ? emiPaid.sub(interestPaid)
            : new Decimal(0);
        const totalPrincipalPayment = principalPaidFromEMI.add(partPayment);

        // Calculate new principal outstanding based on EMI scheme
        // For fixed EMI scheme
        principalOutstanding = principalOutstandingStart
            .sub(totalPrincipalPayment)
            .add(unpaidInterest) // unpaid interest applies to both fixed (increasing tenure in case of skip payment) and reducing EMI (fixed tenure)
            .add(additionalLoan);


        // Update running totals
        totalInterestPaid = totalInterestPaid.add(interestPaid);
        totalPrincipalPaid = totalPrincipalPaid.add(totalPrincipalPayment);
        totalEmiOnlyPaid = totalEmiOnlyPaid.add(emiPaid);
        totalPartPaymentPaid = totalPartPaymentPaid.add(partPayment);

        // Record this month's data
        schedule.push({
            month: getMonthYearFromStart(startDate, monthNumber),
            monthNumber,
            principalOutstandingStart: principalOutstandingStart.toFixed(2),
            emi: emi.toFixed(2),
            emiPaid: emiPaid.toFixed(2),
            emiLeftOrExtra: partPayment.toFixed(2),
            principalInEMI: principalComponent.toFixed(2),
            principalPaid: totalPrincipalPayment.toFixed(2),
            principalLeftOrExtra: totalPrincipalPayment.sub(principalComponent).toFixed(2),
            interestInEMI: interestComponent.toFixed(2),
            interestPaid: interestPaid.toFixed(2),
            interestLeft: unpaidInterest.toFixed(2),
            additionalPrincipal: additionalLoan.toFixed(2),
            effectiveRatePerPeriod: thisMonthRate.mul(100).toFixed(5) + '%'
        });

        // Handle overpayment
        if (principalOutstanding.lt(0)) {
            break;
        }
    }

    // Add refund entry if there's an overpayment
    if (principalOutstanding.lt(0)) {
        schedule.push({
            month: getMonthYearFromStart(startDate, monthNumber + 1),
            monthNumber: monthNumber + 1,
            principalOutstandingStart: principalOutstanding.toFixed(2),
            emi: "0.00",
            emiPaid: "0.00",
            emiLeftOrExtra: "0.00",
            principalInEMI: "0.00",
            principalPaid: "0.00",
            principalLeftOrExtra: "0.00",
            interestInEMI: "0.00",
            interestPaid: "0.00",
            interestLeft: "0.00",
            additionalPrincipal: "0.00",
            effectiveRatePerPeriod: "0.00000%"
        });
    }

    const dashboard = {
        equatedMonthlyInstallment: fixedEMI ? originalEMI.toFixed(2) : "Variable",
        totalMonthsIncurred: schedule.length,
        totalEmiOnlyAmountPaid: totalEmiOnlyPaid.toFixed(2),
        totalPartPaymentAmountPaid: totalPartPaymentPaid.toFixed(2),
        totalEmiPlusPartPaymentPaid: totalEmiOnlyPaid.add(totalPartPaymentPaid).toFixed(2),
        totalPrincipalAmountIncurred: totalPrincipalPaid.toFixed(2),
        totalInterestAmountIncurred: totalInterestPaid.toFixed(2),
        ratePerPeriod: initialRatePerPeriod.mul(100).toFixed(2) + '%',
        totalInterestPercentExpectedWithoutPartPayments: originalEMI.mul(totalPeriods).sub(loanAmount).div(loanAmount).mul(100).toFixed(2) + '%',
        totalInterestAmountExpectedWithoutPartPayments: originalEMI.mul(totalPeriods).sub(loanAmount).toFixed(2),
        totalPaymentExpectedWithoutPartPayments: originalEMI.mul(totalPeriods).toFixed(2),
        totalInterestPercentActuallyIncurred: totalInterestPaid.div(loanAmount).mul(100).toFixed(2) + '%'
    };

    return { schedule, dashboard };
}

export function inputsForCalculatePMTforFixedAndReducingEMIs() {
    // Example usage with partial EMI payments, part payments, and repo rate updates
    let testConfigs = {
        schemeA: {
            loanAmount: 350000,
            termYears: 3,
            annualInterestRate: 8.80,
            paymentsPerYear: 12,
            compoundPeriodsInYears: 3, // currently unused; reserved for future compounding variations
            startDate: "2024-12-30",
            repoRateRevisions: {
            },
            partPayments: {
                2: 78000,
                3: 77000,
                5: 100000,
                6: 37000
            },
            partialEmiPayments: {
            },
            additionalPrincipalInjections: {
            },
            fixedEMI: true
        },
        schemeA2: {
            loanAmount: 350000,
            termYears: 3,
            annualInterestRate: 8.80,
            paymentsPerYear: 12,
            compoundPeriodsInYears: 3, // currently unused; reserved for future compounding variations
            startDate: "2024-12-30",
            repoRateRevisions: {
            },
            partPayments: {
                2: 78000,
                3: 77000,
                5: 100000,
            },
            partialEmiPayments: {
                6: 200
            },
            additionalPrincipalInjections: {
            },
            fixedEMI: true
        },
        schemeB: {
            loanAmount: 1380000,
            termYears: 10,
            annualInterestRate: 9.50,
            paymentsPerYear: 12,
            compoundPeriodsInYears: 3, // currently unused; reserved for future compounding variations
            startDate: "2023-02-06",
            repoRateRevisions: {
                3: { newRate: 9.75, updateEMI: true },
                14: { newRate: 10, updateEMI: false }
            },
            partPayments: {
                1: 0,
                2: 100000,
                3: 100000,
                4: 40000,
                5: 160000,
                6: 0,
                7: 123000,
                8: 100000,
                9: 107000,
                10: 36500,
                11: 36500,
                12: 150000,
                13: 36500,
                14: 63150,
                15: 160000,
            },
            partialEmiPayments: {
            },
            additionalPrincipalInjections: {
            },
            fixedEMI: true
        },
        schemeC: {
            loanAmount: 10477200,
            termYears: 2,
            annualInterestRate: 12,
            paymentsPerYear: 12,
            compoundPeriodsInYears: 3, // currently unused; reserved for future compounding variations
            startDate: "2020-03-25",
            repoRateRevisions: {
            },
            partPayments: {
            },
            partialEmiPayments: {
                1: 0,
                2: 0,
                5: 0,
                6: 0,
                17: 0,
                18: 0,
            },
            additionalPrincipalInjections: {
            },
            fixedEMI: false
        }
    }



    const result = calculateAmortizationSchedule(testConfigs.schemeC);

    return { tableData: result.schedule, dashboard: result.dashboard };
}

export default { inputsForCalculatePMTforFixedAndReducingEMIs };

/*
PROMPT:
create the JS script for generating the **"Loan Amortization Schedule"** with:

# Expected Output Table with the following columns:
Month
Month Number
Total Principal Outstanding at starting of that month
EMI
EMI Paid Amount
EMI Left Amount/ Extra Paid
Principal Payment in EMI
Principal Payment Paid Amount
Principal Payment Left Amount/ Extra Paid
Interest Payment in EMI
Interest Payment Paid Amount
Interest Payment Left Amount
Additional Principal Outstanding in case of skipped EMI
User configurable: Repo Rate Revision at the period level

# Expected Dashboard with the following details:
Equated Monthly Installment ₹11,097.36
Rate Per Period 0.73%
Total Interest % 14.14%
Total No of Periods in complete tenure 36
Total Interest Amount ₹49,504.82 
Total Payment ₹3,99,504.82


# Description:
1. **Precise decimal arithmetic** using `Decimal.js` (up to 9 decimal places). Do not use any other packages like moment.js, etc. use generic functions implementations instead.

2. **User inputs supported:**

   * Loan Amount
   * Annual Interest Rate
   * Payments Per Year
   * Start Date
   * Repo Rate Revisions (by month)
   * Part Payments (by month)
   * Partial EMI Payments (i.e., skipped/partial EMIs)
   * Additional Principal Injections (i.e., additional loans taken)
   * Fixed vs Reducing EMI option (`fixedEMI`)

Loan Amount ₹3,50,000.00
Term of Loan in Years 3
Number of Payments 36
Annual Interest Rate 8.80%
Compound Periods (Yr) 3
Periods (Payments) Per Year 12
Start Date 05-01-2025

3. **Dynamic schedule** that:
   * Terminates early if loan is paid off faster (via part-payments).
   * Extends beyond tenure if EMIs are skipped or more principal is added.

4. **Per-month schedule table** includes:
   * Month, Month Number
   * Principal Outstanding (start of month)
   * EMI, EMI Paid, EMI Left
   * Principal in EMI, Principal Paid, Principal Left
   * Interest in EMI, Interest Paid, Interest Left
   * Additional Principal (includes skipped EMI carry: unpaid interest + added loan if taken any)
   * Effective Interest Rate used each month, repo rates can be revised few times in the middle of the tenure

5. **Inconsistencies with amortization logic**:
   * `principalOutstanding`, `principal`, `interest` paid or remaining should **never be negative**, Only if user paid additional principal more than the remaining loan (principalOutstanding) then display the negative values in the table.
   * In final month, Remaining amount can be less than EMI, pay only that remaining amount: principal + interest, even if EMI is fixed.
   * Schedule is always generated in a loop until `principalOutstanding <= 0`, but extra handling may be needed for dynamic extension.

6. **Duplicate tracking of added principal**:
   * `carryForwardUnpaid` (from skipped EMI)
   * `additionalLoan` (user-defined)
   * **combine** these into `additionalPrincipal` to simplify the table.

*/
