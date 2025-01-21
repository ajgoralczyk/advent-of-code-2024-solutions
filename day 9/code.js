import fs, { cp } from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let checkSum = 0;

  const diskMap = data.split("");
  const files = diskMap.filter((file, index) => {
    if (index % 2 === 0) {
      return true;
    }
  });

  let index = 0;
  const numbersToSum = files.reduce(
    (prev, curr) => Number(prev) + Number(curr),
    0
  );

  let currentDataIndex = 0;
  let currentInnerIndex = 0;

  let currentFrontDataIndex = 0;
  let currentFrontInnerIndex = 0;

  let currentBackDataIndex = files.length - 1;
  let currentBackInnerIndex = files[files.length - 1] - 1;

  while (index < numbersToSum) {
    if (currentDataIndex % 2 === 0) {
      checkSum += index * currentFrontDataIndex;
      currentFrontInnerIndex++;
      if (currentFrontInnerIndex >= files[currentFrontDataIndex]) {
        currentFrontDataIndex++;
        currentFrontInnerIndex = 0;
      }
    } else {
      checkSum += index * currentBackDataIndex;
      currentBackInnerIndex--;
      if (currentBackInnerIndex < 0) {
        currentBackDataIndex--;
        currentBackInnerIndex = files[currentBackDataIndex] - 1;
      }
    }
    index++;
    currentInnerIndex++;
    if (currentInnerIndex >= diskMap[currentDataIndex]) {
      currentDataIndex++;
      currentInnerIndex = 0;
    }
    if (diskMap[currentDataIndex] === "0") {
      currentDataIndex++;
    }
  }

  console.log("Check sum", checkSum);

  const newDiskMap = diskMap.map((size, index) => {
    if (index % 2 === 0) {
      return [
        {
          id: index / 2,
          size: Number(size),
        },
      ];
    }
    return [
      {
        size: -Number(size),
      },
    ];
  });

  for (let i = newDiskMap.length - 1; i > 1; i--) {
    if (newDiskMap[i].length < 1 || newDiskMap[i][0].size <= 0) {
      continue;
    }
    const currentFile = newDiskMap[i][0];
    for (let j = 1; j < i; j++) {
      if (
        newDiskMap[j].length > 0 &&
        newDiskMap[j][0].size <= -1 * currentFile.size
      ) {
        newDiskMap[j - 1].push(currentFile);
        newDiskMap[i].shift();
        newDiskMap[i].unshift({ size: -currentFile.size });
        newDiskMap[j][0].size = newDiskMap[j][0].size + currentFile.size;
        break;
      }
    }
  }

  checkSum = 0;
  index = 0;
  for (let i = 0; i < newDiskMap.length; i++) {
    for (let j = 0; j < newDiskMap[i].length; j++) {
      const currentFile = newDiskMap[i][j];
      if (currentFile.size > 0) {
        for (let k = 0; k < currentFile.size; k++) {
          checkSum += index * currentFile.id;
          index++;
        }
      } else {
        for (let k = 0; k > currentFile.size; k--) {
          index++;
        }
      }
    }
  }

  console.log("New check sum", checkSum);
});
