import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const BLINKS = 75;
  let stones = data.split(" ").map((n) => Number(n));
  let stoneTypes = {};
  for (let stone of stones) {
    stoneTypes[stone] = stoneTypes[stone] || 0;
    stoneTypes[stone] += 1;
  }

  function blink(stone) {
    let afterStones = [];

    if (stone === 0) {
      afterStones.push(1);
    } else if (stone.toString().length % 2 === 0) {
      const stoneToDivide = stone.toString();
      const first = stoneToDivide.substring(0, stoneToDivide.length / 2);
      afterStones.push(Number(first));
      const second = stoneToDivide.substring(
        stoneToDivide.length / 2,
        stoneToDivide.length
      );
      afterStones.push(Number(second));
    } else {
      afterStones.push(stone * 2024);
    }
    return afterStones;
  }

  let newStoneTypes = {};
  for (let i = 0; i < BLINKS; i++) {
    for (let [key, value] of Object.entries(stoneTypes)) {
      let newStones = blink(Number(key));
      for (let newStone of newStones) {
        newStoneTypes[newStone] = newStoneTypes[newStone] || 0;
        newStoneTypes[newStone] += value;
      }
    }
    stoneTypes = newStoneTypes;
    newStoneTypes = {};
  }

  let sum = 0;
  for (let [key, value] of Object.entries(stoneTypes)) {
    // console.log(key, value);
    sum += value;
  }

  console.log("Stones after", BLINKS, "blinks:", sum);
});
