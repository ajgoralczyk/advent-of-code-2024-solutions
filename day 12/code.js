import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  function modulo(n, d) {
    return ((n % d) + d) % d;
  }

  const rows = data.split("\r\n").map((r) => r.split(""));
  const DIRECTIONS = {
    TOP: 0,
    RIGHT: 1,
    BOTTOM: 2,
    LEFT: 3,
  };
  const DIRECTIONS_SIZE = 4;
  let price = 0;
  let lowerPrice = 0;

  function getRegion(i, j) {
    let border = 0;
    let value = rows[i][j];
    let size = 0;
    const region = [];

    function expandRegion(a, b) {
      rows[a][b] = value.toLowerCase();
      size += 1;
      region.push([a, b]);
      if (a > 0) {
        let nextRegion = rows[a - 1][b];
        if (nextRegion !== value.toLowerCase()) {
          if (nextRegion !== value) {
            border += 1;
          } else {
            expandRegion(a - 1, b);
          }
        }
      } else {
        border += 1;
      }
      if (b > 0) {
        let nextRegion = rows[a][b - 1];
        if (nextRegion !== value.toLowerCase()) {
          if (nextRegion !== value) {
            border += 1;
          } else {
            expandRegion(a, b - 1);
          }
        }
      } else {
        border += 1;
      }
      if (a < rows.length - 1) {
        let nextRegion = rows[a + 1][b];
        if (nextRegion !== value.toLowerCase()) {
          if (nextRegion !== value) {
            border += 1;
          } else {
            expandRegion(a + 1, b);
          }
        }
      } else {
        border += 1;
      }
      if (b < rows[0].length - 1) {
        let nextRegion = rows[a][b + 1];
        if (nextRegion !== value.toLowerCase()) {
          if (nextRegion !== value) {
            border += 1;
          } else {
            expandRegion(a, b + 1);
          }
        }
      } else {
        border += 1;
      }
    }

    expandRegion(i, j);
    const walls = countSides(i, j, region);
    return [border * size, walls * size];
  }

  function countSides(i, j, region) {
    let corners = 0;
    let currentDirection = DIRECTIONS.TOP;
    let a = i;
    let b = j;
    let originalPosition = `${a},${b},${currentDirection}`;
    let borders = new Set();
    // console.log(
    //   `Wall for ${rows[a][b]}: ${a},${b}, direction ${currentDirection}`
    // );

    function getNextWall() {
      switch (currentDirection) {
        case DIRECTIONS.TOP:
          if (b === rows[0].length - 1 || rows[a][b + 1] !== rows[a][b]) {
            corners += 1;
            currentDirection = modulo(currentDirection + 1, DIRECTIONS_SIZE);
            break;
          }
          b = b + 1;
          if (a !== 0 && rows[a - 1][b] === rows[a][b]) {
            corners += 1;
            currentDirection = modulo(currentDirection - 1, DIRECTIONS_SIZE);
            a = a - 1;
          }
          break;
        case DIRECTIONS.RIGHT:
          if (a === rows.length - 1 || rows[a + 1][b] !== rows[a][b]) {
            corners += 1;
            currentDirection = modulo(currentDirection + 1, DIRECTIONS_SIZE);
            break;
          }
          a = a + 1;
          if (b !== rows[0].length - 1 && rows[a][b + 1] === rows[a][b]) {
            corners += 1;
            currentDirection = modulo(currentDirection - 1, DIRECTIONS_SIZE);
            b = b + 1;
          }
          break;
        case DIRECTIONS.BOTTOM:
          if (b === 0 || rows[a][b - 1] !== rows[a][b]) {
            corners += 1;
            currentDirection = modulo(currentDirection + 1, DIRECTIONS_SIZE);
            break;
          }
          b = b - 1;
          if (a !== rows.length - 1 && rows[a + 1][b] === rows[a][b]) {
            corners += 1;
            currentDirection = modulo(currentDirection - 1, DIRECTIONS_SIZE);
            a = a + 1;
          }
          break;
        default:
          if (a === 0 || rows[a - 1][b] !== rows[a][b]) {
            corners += 1;
            currentDirection = modulo(currentDirection + 1, DIRECTIONS_SIZE);
            break;
          }
          a = a - 1;
          if (b !== 0 && rows[a][b - 1] === rows[a][b]) {
            corners += 1;
            currentDirection = modulo(currentDirection - 1, DIRECTIONS_SIZE);
            b = b - 1;
          }
          break;
      }
      // console.log(`Next wall: ${a},${b},${currentDirection}`);
      return `${a},${b},${currentDirection}`;
    }

    borders.add(getNextWall());
    while (originalPosition !== `${a},${b},${currentDirection}`) {
      borders.add(getNextWall());
    }

    // holes
    for (let position of region) {
      let [k, l] = position;
      if (
        k > 0 &&
        rows[k][l] !== rows[k - 1][l] &&
        !borders.has(`${k},${l},${DIRECTIONS.TOP}`)
      ) {
        originalPosition = `${k},${l},${DIRECTIONS.TOP}`;
        a = k;
        b = l;
        currentDirection = DIRECTIONS.TOP;
        borders.add(getNextWall());
        while (originalPosition !== `${a},${b},${currentDirection}`) {
          borders.add(getNextWall());
        }
      }
    }

    return corners;
  }

  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[0].length; j++) {
      // console.log("location", i, j);
      if (rows[i][j] !== rows[i][j].toLowerCase()) {
        let [regionPrice, discountedPrice] = getRegion(i, j);
        // console.log("region", rows[i][j], regionPrice);
        price += regionPrice;
        lowerPrice += discountedPrice;
      }
    }
  }

  console.log("Price", price);
  console.log("Lower price", lowerPrice);
});
