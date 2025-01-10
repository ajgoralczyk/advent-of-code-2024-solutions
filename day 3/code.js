import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const regex = /mul\(\d+,\d+\)/g;
  const found = data.match(regex);
  let result = 0;
  found.forEach((element) => {
    const [a, b] = element.split("(")[1].slice(0, -1).split(",");
    result += a * b;
  });
  console.log("Sum", result);

  const regexWithDoAndDont = /mul\(\d+,\d+\)|do\(\)|don't\(\)/g;
  const foundWithDoAndDont = data.match(regexWithDoAndDont);
  let resultWithDoAndDont = 0;
  let sumNex = true;
  for (let i = 0; i < foundWithDoAndDont.length; i++) {
    const element = foundWithDoAndDont[i];
    if (element === "do()") {
      sumNex = true;
      continue;
    }
    if (element === "don't()") {
      sumNex = false;
      continue;
    }
    if (sumNex) {
      const [a, b] = element.split("(")[1].slice(0, -1).split(",");
      resultWithDoAndDont += a * b;
    }
  }
  console.log("Sum with do and don't", resultWithDoAndDont);
});
