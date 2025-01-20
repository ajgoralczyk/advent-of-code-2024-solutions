import fs, { cp } from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const EMPTY = ".";
  const antennas = {};
  const antinodes = new Set();
  const expandedAntinode = new Set();

  const lines = data.split("\r\n");
  const width = lines[0].length;
  const height = lines.length;

  const greatestCommonDivisor = (a, b) => {
    if (b === 0) {
      return a;
    }
    return greatestCommonDivisor(b, a % b);
  };

  for (let i = 0; i < lines.length; i++) {
    for (let j = 0; j < lines[i].length; j++) {
      if (lines[i][j] !== EMPTY) {
        const antennaType = lines[i][j];
        antennas[antennaType] = antennas[antennaType] || [];
        antennas[antennaType].push([i, j]);
      }
    }
  }

  for (let key of Object.keys(antennas)) {
    const keyAntennas = antennas[key];
    for (let i = 0; i < keyAntennas.length; i++) {
      for (let j = i + 1; j < keyAntennas.length; j++) {
        const [x1, y1] = keyAntennas[i];
        const [x2, y2] = keyAntennas[j];
        const dx = x2 - x1;
        const dy = y2 - y1;
        const x3 = x2 + dx;
        const y3 = y2 + dy;
        const x4 = x1 - dx;
        const y4 = y1 - dy;
        if (x3 >= 0 && x3 < height && y3 >= 0 && y3 < width) {
          antinodes.add(`${x3},${y3}`);
        }
        if (x4 >= 0 && x4 < height && y4 >= 0 && y4 < width) {
          antinodes.add(`${x4},${y4}`);
        }
      }
    }
  }
  console.log("Antinodes", antinodes.size);

  for (let key of Object.keys(antennas)) {
    const keyAntennas = antennas[key];
    for (let i = 0; i < keyAntennas.length; i++) {
      for (let j = i + 1; j < keyAntennas.length; j++) {
        const [x1, y1] = keyAntennas[i];
        const [x2, y2] = keyAntennas[j];
        expandedAntinode.add(`${x1},${y1}`);
        expandedAntinode.add(`${x2},${y2}`);
        const dx = x2 - x1;
        const dy = y2 - y1;
        const gcd = greatestCommonDivisor(dx, dy);
        const mindx = dx / gcd;
        const mindy = dy / gcd;

        let x = x2 + mindx;
        let y = y2 + mindy;
        while (x >= 0 && x < height && y >= 0 && y < width) {
          expandedAntinode.add(`${x},${y}`);
          x += mindx;
          y += mindy;
        }

        x = x1 - mindx;
        y = y1 - mindy;
        while (x >= 0 && x < height && y >= 0 && y < width) {
          expandedAntinode.add(`${x},${y}`);
          x -= mindx;
          y -= mindy;
        }
      }
    }
  }

  console.log("Expanded Antinodes", expandedAntinode.size);
});
