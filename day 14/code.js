import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  function modulo(n, d) {
    return ((n % d) + d) % d;
  }

  const WIDTH = 101;
  const HEIGHT = 103;
  const SECONDS = 100;
  let time = SECONDS;

  const robots = data.split("\r\n").map((r) => {
    const [position, velocity] = r.split(" ");
    const regex = /-?\d+/g;
    return {
      position: position.match(regex).map((x) => Number(x)),
      velocity: velocity.match(regex).map((x) => Number(x)),
    };
  });

  // part 1
  for (let robot of robots) {
    for (let i = 0; i < SECONDS; i++) {
      robot.position[0] = modulo(robot.position[0] + robot.velocity[0], WIDTH);
      robot.position[1] = modulo(robot.position[1] + robot.velocity[1], HEIGHT);
    }
  }

  let sum = 0;
  const quadrants = [0, 0, 0, 0];
  for (let robot of robots) {
    if (robot.position[0] < Math.floor(WIDTH / 2)) {
      if (robot.position[1] < Math.floor(HEIGHT / 2)) {
        quadrants[0] += 1;
      }
      if (robot.position[1] > HEIGHT / 2) {
        quadrants[1] += 1;
      }
    }
    if (robot.position[0] > WIDTH / 2) {
      if (robot.position[1] < Math.floor(HEIGHT / 2)) {
        quadrants[2] += 1;
      }
      if (robot.position[1] > HEIGHT / 2) {
        quadrants[3] += 1;
      }
    }
  }

  // part 2

  for (let i = 0; i < 10000; i++) {
    for (let robot of robots) {
      robot.position[0] = modulo(robot.position[0] + robot.velocity[0], WIDTH);
      robot.position[1] = modulo(robot.position[1] + robot.velocity[1], HEIGHT);
    }
    time += 1;

    function isImageOrNoise(map, time) {
      const HEIGHT = map.length;
      const WIDTH = map[0].length;
      const visited = new Array(HEIGHT)
        .fill(false)
        .map(() => new Array(WIDTH).fill(false));
      const directions = [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1], // Up, Down, Left, Right
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1], // Diagonals
      ];

      function isValid(x, y) {
        return x >= 0 && x < HEIGHT && y >= 0 && y < WIDTH;
      }

      function dfs(x, y) {
        const stack = [[x, y]];
        let size = 0;

        while (stack.length > 0) {
          const [cx, cy] = stack.pop();
          if (!isValid(cx, cy) || visited[cx][cy] || map[cx][cy] !== "*")
            continue;
          visited[cx][cy] = true;
          size++;

          for (const [dx, dy] of directions) {
            const nx = cx + dx;
            const ny = cy + dy;
            if (isValid(nx, ny) && !visited[nx][ny] && map[nx][ny] === "*") {
              stack.push([nx, ny]);
            }
          }
        }

        return size;
      }

      let largestComponentSize = 0;
      for (let i = 0; i < HEIGHT; i++) {
        for (let j = 0; j < WIDTH; j++) {
          if (!visited[i][j] && map[i][j] === "*") {
            const componentSize = dfs(i, j);
            largestComponentSize = Math.max(
              largestComponentSize,
              componentSize
            );
          }
        }
      }

      // Threshold for determining if the image is random or not
      const threshold = (HEIGHT * WIDTH) / 100; // Example: 1% of the total pixels
      return largestComponentSize > threshold;
    }

    let map = new Array(HEIGHT).fill([]);
    map = map.map((r) => new Array(WIDTH).fill("."));
    for (let robot of robots) {
      map[robot.position[1]][robot.position[0]] = "*";
    }

    let isImage = isImageOrNoise(map, time);
    if (isImage) {
      console.log("Image found:", time);
      break;
    }
  }

  let map = new Array(HEIGHT).fill([]);
  map = map.map((r) => new Array(WIDTH).fill("."));
  for (let robot of robots) {
    map[robot.position[1]][robot.position[0]] = "*";
  }
  console.log(map.map((row) => row.join("")).join("\n"));

  console.log(
    "Safety factor",
    quadrants,
    quadrants.reduce((s, x) => s * x, 1)
  );
});
