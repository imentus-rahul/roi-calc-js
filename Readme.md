# Financial Analysis Toolkit - Node.js

## Key Features:

### Compound Interest Rate Calculator:

- Utilizes a binary search-like algorithm to accurately compute compound interest rates.
- Adapts to varying scenarios, allowing for dynamic inputs such as principal, future value, payment frequency, and years.
- Guarantees precise results while optimizing computation for efficiency.

### Yearly Interest and Contributions Chart Generator:

- Produces comprehensive yearly charts that break down contributions, interest, and cumulative figures.
- Considers both compound interest and simple interest calculations.
- Offers a detailed view of how yearly contributions contribute to the overall future value.

### CSV Export Functionality:

- Exports the generated data, including charts and calculated rates, to CSV files.
- Supports easy data analysis, visualization, and sharing.

## Usage:

- Clone or download this repository.
- Customize the JavaScript file to define your financial scenario, including initial investment, future value, payment schedule, and more.
- Use the provided functions to calculate compound interest rates and generate yearly interest and contributions charts.
- Install node modules using `npm i`
- run it using `node index.js CAGRBasedOnFutureValue`
- Export the results to CSV files for further analysis and reporting.

# CAGR Based on Future Value Calculator

## Overview

The `CAGRBasedOnFutureValue.js` module provides a robust solution for calculating the Compound Annual Growth Rate (CAGR) based on a desired future value. It utilizes a binary search-like algorithm to efficiently determine the interest rate required to achieve a specified future value from a given principal amount, over a defined number of years with optional annual payments.

## Key Features

- **Accurate CAGR Calculation**: The module employs a binary search algorithm to find the interest rate that results in the desired future value.
- **Dynamic Input Handling**: Users can input various parameters, including principal, future value, number of years, and annual payments, allowing for flexible financial planning.
- **Yearly Interest Chart Generation**: The module can generate a detailed chart showing yearly contributions, interest earned, and cumulative totals.

## Input Parameters

To use the functionality, you need to provide the following inputs:

- `principal`: The initial investment amount (number).
- `actualFutureValue`: The target future value you wish to achieve (number).
- `nper`: The number of years over which the investment will grow (number).
- `annualPayment`: The amount added to the investment each year (number).
- `number_of_years_recursive_payment_made`: The number of years during which annual payments are made (number).

## Output

The output includes:

- The calculated CAGR as a percentage.
- A detailed yearly interest chart that breaks down contributions, interest earned, and cumulative totals.

## Generating Output CSV Files

To export the results to CSV files:

1. Ensure you have the necessary node modules installed by running `npm install`.
2. Execute the script using `node index.js CAGRBasedOnFutureValue`.
3. The generated data, including charts and calculated rates, will be exported to CSV files for further analysis and reporting.

## Example Usage

```javascript
import { inputsForCalculateCompoundInterestRate } from "./CAGRBasedOnFutureValue.js";

const result = inputsForCalculateCompoundInterestRate();
// The result will include the CAGR and yearly interest chart data.
```

# Loan Amortization Schedule Calculator

## Overview

The `PMTforFixedAndReducingEMIs.js` module calculates the amortization schedule for loans with fixed or reducing Equated Monthly Installments (EMIs). It supports dynamic repo rate revisions, part payments, and additional principal injections, providing a comprehensive view of loan repayment over time.

## Key Features

- **Dynamic Amortization Schedule**: The module generates a detailed schedule that tracks principal and interest payments over the loan term.
- **Flexible Payment Options**: Users can specify part payments, partial EMI payments, and additional principal injections, allowing for a tailored repayment strategy.
- **Dashboard Summary**: The module provides a dashboard summarizing key metrics such as total interest paid, total payments made, and effective interest rates.

## Input Parameters

To use the functionality, you need to provide the following inputs:

- `loanAmount`: The total amount of the loan (number).
- `annualInterestRate`: The annual interest rate (number).
- `paymentsPerYear`: The number of payments made per year (number).
- `termYears`: The total term of the loan in years (number).
- `startDate`: The start date of the loan (string in YYYY-MM-DD format).
- `repoRateRevisions`: An object specifying any changes to the repo rate by month (object).
- `partPayments`: An object specifying any part payments made by month (object).
- `partialEmiPayments`: An object specifying any partial EMI payments made (object).
- `additionalPrincipalInjections`: An object specifying any additional principal injections made (object).
- `fixedEMI`: A boolean indicating whether the EMI is fixed or variable (boolean).

## Output

The output includes:

- A detailed amortization schedule showing month-by-month payments, principal outstanding, and interest paid.
- A dashboard summarizing key metrics such as total interest incurred and effective interest rates.

## Generating Output CSV Files

To export the results to CSV files:

1. Ensure you have the necessary node modules installed by running `npm install`.
2. Execute the script using `node index.js PMTforFixedAndReducingEMIs`.
3. The generated amortization schedule and dashboard summary will be exported to CSV files for further analysis and reporting.

## Example Usage

```javascript
import { inputsForCalculatePMTforFixedAndReducingEMIs } from "./PMTforFixedAndReducingEMIs.js";

const result = inputsForCalculatePMTforFixedAndReducingEMIs();
// The result will include the amortization schedule and dashboard data.
```
