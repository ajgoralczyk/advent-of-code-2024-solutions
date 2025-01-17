import fs, { cp } from "node:fs";
import { solution } from "./solutions.js";

const missing = new Set([
  "90,100",
  "19,81",
  "64,29",
  "92,42",
  "106,47",
  "47,76",
  "82,32",
  "112,77",
  "111,22",
  "110,102",
  "109,50",
  "46,91",
  "102,90",
  "101,55",
  "13,56",
  "27,86",
  "22,58",
  "23,108",
  "11,69",
  "12,89",
  "5,57",
  "1,58",
  "7,48",
  "78,57",
  "54,31",
  "53,15",
  "112,10",
  "76,83",
  "119,82",
  "61,62",
  "62,120",
  "85,119",
  "77,109",
  "97,114",
  "125,113",
  "16,104",
  "50,103",
  "49,31",
  "40,59",
  "57,22",
  "38,23",
  "39,26",
  "73,25",
  "51,32",
  "34,14",
  "41,7",
  "107,27",
  "91,59",
  "125,58",
  "93,94",
  "120,93",
  "49,92",
  "83,77",
  "60,78",
  "67,63",
  "35,124",
  "18,91",
  "40,120",
  "38,115",
]);

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const rows = data.split("\r\n").map((row) => row.split(""));

  const GUARD_DIRECTIONS = {
    UP: "^",
    DOWN: "v",
    LEFT: "<",
    RIGHT: ">",
  };
  const GUARD = ["^", "v", "<", ">"];
  const OBSTACLE = "#";
  const VISITED = "X";
  const EMPTY = ".";
  const VISITED_WITH_DIRECTION = {
    "^": "^",
    v: "v",
    "<": "<",
    ">": ">",
  };

  let current;

  function getNextStep(map, currentLocation) {
    let [row, col, direction] = currentLocation;
    if (direction === GUARD_DIRECTIONS.UP) {
      if (row === 0) return null;
      if (map[row - 1][col] === OBSTACLE) {
        let newDirection = GUARD_DIRECTIONS.RIGHT;
        return getNextStep(map, [row, col, newDirection]);
      }
      return [row - 1, col, direction];
    }
    if (direction === GUARD_DIRECTIONS.DOWN) {
      if (row === map.length - 1) return null;
      if (map[row + 1][col] === OBSTACLE) {
        let newDirection = GUARD_DIRECTIONS.LEFT;
        return getNextStep(map, [row, col, newDirection]);
      }
      return [row + 1, col, direction];
    }
    if (direction === GUARD_DIRECTIONS.LEFT) {
      if (col === 0) return null;
      if (map[row][col - 1] === OBSTACLE) {
        let newDirection = GUARD_DIRECTIONS.UP;
        return getNextStep(map, [row, col, newDirection]);
      }
      return [row, col - 1, direction];
    }
    if (direction === GUARD_DIRECTIONS.RIGHT) {
      if (col === map[row].length - 1) return null;
      if (map[row][col + 1] === OBSTACLE) {
        let newDirection = GUARD_DIRECTIONS.DOWN;
        return getNextStep(map, [row, col, newDirection]);
      }
      return [row, col + 1, direction];
    }
  }

  // get initial position of the guard
  for (let i = 0; i < rows.length; i++) {
    for (let j = 0; j < rows[i].length; j++) {
      if (GUARD.includes(rows[i][j])) {
        current = [i, j];
        switch (rows[i][j]) {
          case GUARD_DIRECTIONS.UP:
            current.push(GUARD_DIRECTIONS.UP);
            break;
          case GUARD_DIRECTIONS.DOWN:
            current.push(GUARD_DIRECTIONS.DOWN);
            break;
          case GUARD_DIRECTIONS.LEFT:
            current.push(GUARD_DIRECTIONS.LEFT);
            break;
          case GUARD_DIRECTIONS.RIGHT:
            current.push(GUARD_DIRECTIONS.RIGHT);
            break;
          default:
            break;
        }
        break;
      }
    }
  }

  // move the guard while it's on the map
  // let visitedPositions = 0;
  // while (current != null) {
  //   const [row, col, direction] = current;
  //   if (rows[row][col] !== VISITED) {
  //     rows[row][col] = VISITED;
  //     visitedPositions += 1;
  //   }

  //   const next = getNextStep(rows, current);
  //   current = next;
  // }

  // console.log("Visited positions", visitedPositions);

  let newObstacle = new Set();

  while (current != null) {
    const [row, col, direction] = current;
    if (rows[row][col] === EMPTY) {
      rows[row][col] = VISITED_WITH_DIRECTION[direction];
    }

    // try adding obstacle in front
    let newObstacleLocation = getNextStep(rows, current);

    // search for a loop
    if (
      newObstacleLocation != null &&
      rows[newObstacleLocation[0]][newObstacleLocation[1]] === EMPTY
    ) {
      let newMap = rows.map((row) => [...row]);
      let [newRow, newCol] = newObstacleLocation;
      newMap[newRow][newCol] = OBSTACLE;
      let next = getNextStep(newMap, current);

      while (next !== null) {
        let [newRow, newCol, direction] = next;

        // if loop found
        if (newMap[newRow][newCol] === direction) {
          newObstacle.add(newObstacleLocation.join(","));
          break;
        }
        if (newMap[newRow][newCol] === EMPTY) {
          newMap[newRow][newCol] = direction;
        }
        next = getNextStep(newMap, next);
      }
    }

    let next = getNextStep(rows, current);
    current = next;
  }

  console.log("New obstacle locations", newObstacle.size);
});
