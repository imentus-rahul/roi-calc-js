// let a = 4.000_015_649_944_543_838_5
// let b = 1.000_000_001
let a = 20000000.000_000_01 // 20000000.000_000_011 // toFixed(9) auto inserts +1 in decimal values
let b = 20000000
console.log("🚀 ~ file: nodejs-tofixed.js:6 ~ a.toFixed(9):", a.toFixed(9)); // It will automatically round up the value 
console.log("🚀 ~ file: nodejs-tofixed.js:7 ~ Math.abs(a.toFixed(9) - b.toFixed(9)):", Math.abs(a.toFixed(9) - b.toFixed(9)));
console.log("🚀 ~ file: nodejs-tofixed.js:9 ~ Math.abs(a - b):", Math.abs(a - b));
console.log("🚀 ~ file: nodejs-tofixed.js:11 ~ (a.toFixed(9) - b.toFixed(9)):", (a.toFixed(9) - b.toFixed(9)));
console.log("🚀 ~ file: nodejs-tofixed.js:13 ~ (a - b):", (a - b));

// Parse the fixed strings back to numbers
let aNumber = parseFloat(a.toFixed(9));
let bNumber = parseFloat(b.toFixed(9));
console.log("🚀 ~ file: nodejs-tofixed.js:15 ~  (aNumber - bNumber).toFixed(9):",  (aNumber - bNumber).toFixed(9));
console.log("🚀 ~ file: nodejs-tofixed.js:17 ~ (aNumber - bNumber):", (aNumber - bNumber));
