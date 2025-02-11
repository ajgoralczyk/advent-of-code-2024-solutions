import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const [warehouseData, movementsData] = data.split("\r\n\r\n");

  const warehouse = warehouseData.split("\r\n").map((row) => row.split(""));
  const biggerWarehouse = warehouse.map((row) =>
    row.reduce((prev, el) => {
      switch (el) {
        case "#":
          return prev.concat(["#", "#"]);
        case "O":
          return prev.concat(["[", "]"]);
        case ".":
          return prev.concat([".", "."]);
        case "@":
          return prev.concat(["@", "."]);
      }
    }, [])
  );

  const movements = movementsData.split("\r\n").join("").split("");
  let robot;

  function move(direction, position) {
    switch (direction) {
      case "^":
        return [position[0] - 1, position[1]];

      case ">":
        return [position[0], position[1] + 1];

      case "v":
        return [position[0] + 1, position[1]];

      case "<":
        return [position[0], position[1] - 1];
    }
  }

  function canMoveBiggerBox(direction, position) {
    let left, right;
    if (biggerWarehouse[position[0]][position[1]] === "[") {
      left = position;
      right = [position[0], position[1] + 1];
    } else {
      left = [position[0], position[1] - 1];
      right = position;
    }

    let canMoveLeftSide, canMoveRightSide;
    let newLeft = move(direction, left);
    let newRight = move(direction, right);

    if (direction === "^" || direction === "v") {
      if (biggerWarehouse[newLeft[0]][newLeft[1]] === ".") {
        canMoveLeftSide = true;
      } else if (biggerWarehouse[newLeft[0]][newLeft[1]] === "#") {
        canMoveLeftSide = false;
      } else {
        canMoveLeftSide = canMoveBiggerBox(direction, newLeft);
      }

      if (biggerWarehouse[newRight[0]][newRight[1]] === ".") {
        canMoveRightSide = true;
      } else if (biggerWarehouse[newRight[0]][newRight[1]] === "#") {
        canMoveRightSide = false;
      } else {
        canMoveRightSide = canMoveBiggerBox(direction, newRight);
      }
      return canMoveLeftSide && canMoveRightSide;
    } else {
      if (direction === "<") {
        if (biggerWarehouse[newLeft[0]][newLeft[1]] === ".") {
          return true;
        }
        if (biggerWarehouse[newLeft[0]][newLeft[1]] === "#") {
          return false;
        }
        return canMoveBiggerBox(direction, newLeft);
      }
      if (direction === ">") {
        if (biggerWarehouse[newRight[0]][newRight[1]] === ".") {
          return true;
        }
        if (biggerWarehouse[newRight[0]][newRight[1]] === "#") {
          return false;
        }
        return canMoveBiggerBox(direction, newRight);
      }
    }
  }

  function moveBiggerBox(direction, position) {
    let left, right;
    if (biggerWarehouse[position[0]][position[1]] === "[") {
      left = position;
      right = [position[0], position[1] + 1];
    } else {
      left = [position[0], position[1] - 1];
      right = position;
    }

    let newLeft = move(direction, left);
    let newRight = move(direction, right);

    if (direction === "^" || direction === "v") {
      if (
        biggerWarehouse[newLeft[0]][newLeft[1]] === "[" ||
        biggerWarehouse[newLeft[0]][newLeft[1]] === "]"
      ) {
        moveBiggerBox(direction, newLeft);
      }
      if (
        biggerWarehouse[newRight[0]][newRight[1]] === "[" ||
        biggerWarehouse[newRight[0]][newRight[1]] === "]"
      ) {
        moveBiggerBox(direction, newRight);
      }
    } else {
      if (direction === "<") {
        if (biggerWarehouse[newLeft[0]][newLeft[1]] === "]") {
          moveBiggerBox(direction, newLeft);
        }
      }
      if (direction === ">") {
        if (biggerWarehouse[newRight[0]][newRight[1]] === "[") {
          moveBiggerBox(direction, newRight);
        }
      }
    }

    biggerWarehouse[left[0]][left[1]] = ".";
    biggerWarehouse[right[0]][right[1]] = ".";
    biggerWarehouse[newLeft[0]][newLeft[1]] = "[";
    biggerWarehouse[newRight[0]][newRight[1]] = "]";
  }

  // smaller warehouse
  for (let i = 0; i < warehouse.length; i++) {
    for (let j = 0; j < warehouse[0].length; j++) {
      if (warehouse[i][j] === "@") {
        robot = [i, j];
        warehouse[i][j] = ".";
      }
    }
  }

  for (let movement of movements) {
    let nextPosition = move(movement, robot);
    if (warehouse[nextPosition[0]][nextPosition[1]] === ".") {
      robot = [...nextPosition];
    } else if (warehouse[nextPosition[0]][nextPosition[1]] === "O") {
      let newBoxPosition = move(movement, robot);
      while (warehouse[newBoxPosition[0]][newBoxPosition[1]] === "O") {
        newBoxPosition = move(movement, newBoxPosition);
      }
      if (warehouse[newBoxPosition[0]][newBoxPosition[1]] === ".") {
        warehouse[newBoxPosition[0]][newBoxPosition[1]] = "O";
        warehouse[nextPosition[0]][nextPosition[1]] = ".";
        robot = [...nextPosition];
      }
    }
  }

  // bigger warehouse
  for (let i = 0; i < biggerWarehouse.length; i++) {
    for (let j = 0; j < biggerWarehouse[0].length; j++) {
      if (biggerWarehouse[i][j] === "@") {
        robot = [i, j];
        biggerWarehouse[i][j] = ".";
      }
    }
  }

  for (let movement of movements) {
    let nextPosition = move(movement, robot);
    let nextPositionStatus = biggerWarehouse[nextPosition[0]][nextPosition[1]];
    if (nextPositionStatus === ".") {
      robot = [...nextPosition];
    } else if (nextPositionStatus === "[" || nextPositionStatus === "]") {
      if (canMoveBiggerBox(movement, nextPosition)) {
        moveBiggerBox(movement, nextPosition);
        robot = [...nextPosition];
      }
    }
  }

  // check GPS coordinates
  let boxCoordinates = 0;
  for (let i = 0; i < warehouse.length; i++) {
    for (let j = 0; j < warehouse[0].length; j++) {
      if (warehouse[i][j] === "O") {
        boxCoordinates += i * 100 + j;
      }
    }
  }

  let biggerBoxCoordinates = 0;
  for (let i = 0; i < biggerWarehouse.length; i++) {
    for (let j = 0; j < biggerWarehouse[0].length; j++) {
      if (biggerWarehouse[i][j] === "[") {
        biggerBoxCoordinates += i * 100 + j;
      }
    }
  }

  console.log("Coordinates sum", boxCoordinates);
  console.log("Bigger warehouse coordinates sum", biggerBoxCoordinates);
});
