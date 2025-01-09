import { data } from "./data.js";

function isSafe(report) {
  const increasing = report[1] > report[0];
  let safeReport = true;

  for (let i = 1; i < report.length; i++) {
    if (report[i] > report[i - 1] !== increasing) {
      safeReport = false;
      break;
    }
    const difference = Math.abs(report[i] - report[i - 1]);
    if (difference < 1 || difference > 3) {
      safeReport = false;
      break;
    }
  }
  return safeReport;
}

let safe = 0;
for (let j = 0; j < data.length; j++) {
  const report = data[j].split(" ").map((el) => Number(el));
  const safeReport = isSafe(report);
  if (safeReport) {
    safe += 1;
  }
}

console.log("Safe reports", safe);

safe = 0;
for (let j = 0; j < data.length; j++) {
  const report = data[j].split(" ").map((el) => Number(el));
  let safeReport = isSafe(report);
  if (!safeReport) {
    for (let k = 0; k < data[j].length - 1; k++) {
      const newReport = report.toSpliced(k, 1);
      safeReport = isSafe(newReport);
      if (safeReport) {
        break;
      }
    }
  }
  if (safeReport) {
    safe += 1;
  }
}

console.log("Safe reports (with single level tolerance)", safe);
