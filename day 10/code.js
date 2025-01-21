import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  let trailheadsScoreSum = 0;
  let trailheadsRatingSum = 0;
  const rows = data.split("\r\n");
  // console.log(rows);

  function getTrailheadsScore(i, j) {
    const trailends = new Set();

    function getNextStep(i, j) {
      if (rows[i][j] === "9") {
        trailends.add(`${i},${j}`);
      }
      const currentValue = Number(rows[i][j]);
      if (i > 0 && Number(rows[i - 1][j]) === currentValue + 1) {
        getNextStep(i - 1, j);
      }
      if (j > 0 && Number(rows[i][j - 1]) === currentValue + 1) {
        getNextStep(i, j - 1);
      }
      if (i < rows.length - 1 && Number(rows[i + 1][j]) === currentValue + 1) {
        getNextStep(i + 1, j);
      }
      if (j < rows[0].length && Number(rows[i][j + 1]) === currentValue + 1) {
        getNextStep(i, j + 1);
      }
    }

    getNextStep(i, j);
    return trailends.size;
  }

  function getTrailheadsRating(i, j) {
    const trailends = new Set();

    function getNextStep(i, j, path) {
      if (rows[i][j] === "9") {
        trailends.add(path + `${i},${j}`);
      }
      const currentValue = Number(rows[i][j]);
      if (i > 0 && Number(rows[i - 1][j]) === currentValue + 1) {
        getNextStep(i - 1, j, path + `${i - 1},${j}`);
      }
      if (j > 0 && Number(rows[i][j - 1]) === currentValue + 1) {
        getNextStep(i, j - 1, path + `${i},${j - 1}`);
      }
      if (i < rows.length - 1 && Number(rows[i + 1][j]) === currentValue + 1) {
        getNextStep(i + 1, j, path + `${i + 1},${j}`);
      }
      if (j < rows[0].length && Number(rows[i][j + 1]) === currentValue + 1) {
        getNextStep(i, j + 1, path + `${i},${j + 1}`);
      }
    }

    getNextStep(i, j, "");
    return trailends.size;
  }

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[0].length; j++) {
      if (rows[i][j] === "0") {
        trailheadsScoreSum += getTrailheadsScore(i, j);
        trailheadsRatingSum += getTrailheadsRating(i, j);
      }
    }
  }

  console.log("Trails sum", trailheadsScoreSum);
  console.log("Trail rating", trailheadsRatingSum);
});
