import fs from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const wholeData = data.split("\r\n\r\n");
  const rules = wholeData[0].split("\r\n");
  const updates = wholeData[1].split("\r\n");
  const ruleMap = new Map();

  for (let rule of rules) {
    const [before, after] = rule.split("|");
    ruleMap.set(before, ruleMap.get(before) || new Set());
    ruleMap.get(before).add(after);
  }
  // console.log(ruleMap);

  const correctUpdates = [];
  const incorrectUpdates = [];
  for (let update of updates) {
    let correct = true;
    const pagesToUpdate = update.split(",");
    for (let i = 1; i < pagesToUpdate.length - 1; i++) {
      const afterPages = ruleMap.get(pagesToUpdate[i]) || new Set();

      for (let j = i - 1; j >= 0; j--) {
        if (afterPages.has(pagesToUpdate[j])) {
          correct = false;
          break;
        }
      }
    }
    if (correct) {
      correctUpdates.push(pagesToUpdate);
    } else {
      incorrectUpdates.push(pagesToUpdate);
    }
  }

  const sumOfCorrectMiddleElements = correctUpdates.reduce((acc, update) => {
    return acc + Number(update[Math.floor(update.length / 2)]);
  }, 0);

  console.log(
    "Sum of middle elements of correct updates",
    sumOfCorrectMiddleElements
  );

  let correctedUpdates = [];

  for (let update of incorrectUpdates) {
    // sort update
    const pagesToUpdate = new Set(update);
    const relations = {};
    for (let page of update) {
      relations[page] = ruleMap.get(page).intersection(pagesToUpdate);
    }
    correctedUpdates.push(
      update.toSorted((a, b) => relations[a].size - relations[b].size)
    );
  }

  const sumOfIncorrectMiddleElements = correctedUpdates.reduce(
    (acc, update) => {
      return acc + Number(update[Math.floor(update.length / 2)]);
    },
    0
  );

  console.log(
    "Sum of middle elements of corrected incorrect updates",
    sumOfIncorrectMiddleElements
  );
});
