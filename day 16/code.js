import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  // move - 1 point
  // rotation - 1000 points
  const maze = data.split("\r\n").map((row) => row.split(""));
  let S;
  let E;
  let lowestScore = 0;
  let paths = {};
  const DIRECTIONS = ["up", "right", "down", "left"];
  const DIRECTION = {
    UP: "up",
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
  };

  for (let i = 0; i < maze.length; i++) {
    for (let j = 0; j < maze[i].length; j++) {
      if (maze[i][j] === "S") {
        S = [i, j];
        maze[i][j] = 0;
      }
      if (maze[i][j] === "E") {
        E = [i, j];
      }
    }
  }

  let currentPosition = S;
  let currentScore = 0;
  let currentDirection = DIRECTION.RIGHT;

  function updateNeighbours(position, score, direction, previousPath) {
    if (maze[position[0]][position[1]] === "E") {
      return;
    }
    let straight = getLocation(direction, position);
    let left = getLocation(getLeft(direction), position);
    let right = getLocation(getRight(direction), position);

    checkLocation(straight, score + 1, direction, previousPath);
    checkLocation(left, score + 1001, getLeft(direction), previousPath);
    checkLocation(right, score + 1001, getRight(direction), previousPath);
  }
  updateNeighbours(currentPosition, currentScore, currentDirection, []);

  function printMaze(m) {
    console.log("Maze");
    for (let i = 0; i < m.length; i++) {
      console.log(m[i].join(""));
    }
  }
  function checkLocation(position, score, direction, previousPath) {
    let currentValue = maze[position[0]][position[1]];
    if (currentValue === "#") {
      return;
    }
    if (currentValue === "E") {
      paths[score] = paths[score] || [];
      paths[score].push(previousPath);
      if (score < lowestScore || lowestScore === 0) {
        lowestScore = score;
      }
      return;
    }
    if (
      (Number.isInteger(currentValue) && currentValue + 1000 >= score) ||
      currentValue === "."
    ) {
      maze[position[0]][position[1]] = score;
      updateNeighbours(position, score, direction, [...previousPath, position]);
    }
  }
  function getLeft(direction) {
    return DIRECTIONS[(DIRECTIONS.indexOf(direction) + 3) % 4];
  }

  function getRight(direction) {
    return DIRECTIONS[(DIRECTIONS.indexOf(direction) + 1) % 4];
  }

  function getLocation(direction, position) {
    switch (direction) {
      case DIRECTION.UP:
        return [position[0] - 1, position[1]];

      case DIRECTION.RIGHT:
        return [position[0], position[1] + 1];

      case DIRECTION.DOWN:
        return [position[0] + 1, position[1]];

      case DIRECTION.LEFT:
        return [position[0], position[1] - 1];
    }
  }

  let shortestPaths = paths[lowestScore];
  let shortestPathLocations = new Set();
  shortestPaths.forEach((path) => {
    shortestPathLocations = shortestPathLocations.union(
      new Set(path.map((p) => p.join(",")))
    );
  });

  const newMaze = data.split("\r\n").map((row) => row.split(""));
  for (let i = 0; i < newMaze.length; i++) {
    for (let j = 0; j < newMaze[i].length; j++) {
      if (shortestPathLocations.has([i, j].join(","))) {
        newMaze[i][j] = "O";
      }
    }
  }

  // printMaze(newMaze);
  console.log("Lowest score", lowestScore);
  console.log("Shortests paths locations", shortestPathLocations.size + 2); // 2 for S & E
});
