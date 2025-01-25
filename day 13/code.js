// import fs from "node:fs";

// fs.readFile("./data.txt", "utf8", (err, data) => {
//   if (err) {
//     console.error(err);
//     return;
//   }

//   let totalTokens = 0;
//   const machines = data.split("\r\n\r\n").map((m) => m.split("\r\n"));
//   for (let machine of machines) {
//     const buttonA = machine[0].match(/\d+/g);
//     const buttonB = machine[1].match(/\d+/g);
//     const prize = machine[2].match(/\d+/g);

//     // find min a to fit
//     for (let aCount = 0; aCount < Math.ceil(prize[0] / buttonA[0]); aCount++) {
//       let bCount = (prize[0] - buttonA[0] * aCount) / buttonB[0];
//       if (!Number.isInteger(bCount)) {
//         continue;
//       }
//       if (prize[1] - buttonA[1] * aCount - buttonB[1] * bCount !== 0) {
//         continue;
//       }
//       totalTokens += aCount * 3 + bCount;
//       // console.log({ aCount, bCount }, aCount * 3 + bCount);
//     }
//   }

//   console.log(totalTokens);
// });

import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let totalTokens = 0;
  const machines = data.split("\r\n\r\n").map((m) => m.split("\r\n"));
  for (let machine of machines) {
    const buttonA = machine[0].match(/\d+/g).map(Number);
    const buttonB = machine[1].match(/\d+/g).map(Number);
    const prize = machine[2].match(/\d+/g).map(Number);
    prize[0] += 10000000000000;
    prize[1] += 10000000000000;

    // Solve the system of equations
    const a0 = buttonA[0];
    const a1 = buttonA[1];
    const b0 = buttonB[0];
    const b1 = buttonB[1];
    const p0 = prize[0];
    const p1 = prize[1];

    let foundSolution = false;

    // Coefficient matrix
    const A = [
      [a0, b0],
      [a1, b1],
    ];

    // Determinant of A
    const detA = A[0][0] * A[1][1] - A[0][1] * A[1][0];

    if (detA === 0) {
      console.log("No unique solution exists for this machine.");
      continue;
    }

    // Inverse of A (multiplied by 1/detA)
    const invA = [
      [A[1][1] / detA, -A[0][1] / detA],
      [-A[1][0] / detA, A[0][0] / detA],
    ];

    // Multiply invA by the prize vector
    const countA = Math.round(invA[0][0] * p0 + invA[0][1] * p1);
    const countB = Math.round(invA[1][0] * p0 + invA[1][1] * p1);

    // Check if the solution is valid
    if (
      countA >= 0 &&
      countB >= 0 &&
      a0 * countA + b0 * countB === p0 &&
      a1 * countA + b1 * countB === p1
    ) {
      // console.log({ countA, countB }, countA * 3 + countB);
      totalTokens += countA * 3 + countB;
    } else {
      // console.log("No valid solution found for this machine.");
    }
  }

  console.log("Total Tokens:", totalTokens);
});
