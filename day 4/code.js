import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let splitData = data.split("\r\n");
  let xmasCount = 0;

  function checkForXmas(mJ, mI, aJ, aI, sJ, sI) {
    if (
      sI >= 0 &&
      sJ >= 0 &&
      sI < splitData.length &&
      sJ < splitData[sI].length &&
      splitData[mI][mJ] === "M" &&
      splitData[aI][aJ] === "A" &&
      splitData[sI][sJ] === "S"
    ) {
      xmasCount++;
    }
  }

  for (let i = 0; i < splitData.length; i++) {
    for (let j = 0; j < splitData[i].length; j++) {
      if (splitData[i][j] === "X") {
        //check right
        checkForXmas(j + 1, i, j + 2, i, j + 3, i);
        //check left
        checkForXmas(j - 1, i, j - 2, i, j - 3, i);
        //check up
        checkForXmas(j, i - 1, j, i - 2, j, i - 3);
        //check down
        checkForXmas(j, i + 1, j, i + 2, j, i + 3);
        //check up right
        checkForXmas(j + 1, i - 1, j + 2, i - 2, j + 3, i - 3);
        //check up left
        checkForXmas(j - 1, i - 1, j - 2, i - 2, j - 3, i - 3);
        //check down right
        checkForXmas(j + 1, i + 1, j + 2, i + 2, j + 3, i + 3);
        //check down left
        checkForXmas(j - 1, i + 1, j - 2, i + 2, j - 3, i + 3);
      }
    }
  }

  console.log("XMAS", xmasCount);

  // ----------------------
  let masCrossCount = 0;

  function checkForMasCross(topI, bottomI, leftJ, rightJ) {
    if (
      topI >= 0 &&
      leftJ >= 0 &&
      bottomI < splitData.length &&
      rightJ < splitData[topI].length
    ) {
      if (
        splitData[topI][leftJ] === "M" &&
        splitData[topI][rightJ] === "M" &&
        splitData[bottomI][leftJ] === "S" &&
        splitData[bottomI][rightJ] === "S"
      ) {
        masCrossCount++;
      }
      if (
        splitData[topI][leftJ] === "M" &&
        splitData[topI][rightJ] === "S" &&
        splitData[bottomI][leftJ] === "M" &&
        splitData[bottomI][rightJ] === "S"
      ) {
        masCrossCount++;
      }
      if (
        splitData[topI][leftJ] === "S" &&
        splitData[topI][rightJ] === "S" &&
        splitData[bottomI][leftJ] === "M" &&
        splitData[bottomI][rightJ] === "M"
      ) {
        masCrossCount++;
      }
      if (
        splitData[topI][leftJ] === "S" &&
        splitData[topI][rightJ] === "M" &&
        splitData[bottomI][leftJ] === "S" &&
        splitData[bottomI][rightJ] === "M"
      ) {
        masCrossCount++;
      }
    }
  }

  for (let i = 0; i < splitData.length; i++) {
    for (let j = 0; j < splitData[i].length; j++) {
      if (splitData[i][j] === "A") {
        checkForMasCross(i - 1, i + 1, j - 1, j + 1);
      }
    }
  }

  console.log("MAS Cross", masCrossCount);
});
