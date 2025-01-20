import fs, { cp } from "node:fs";

fs.readFile("./data.txt", "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  let totalCorrect = 0;
  let totalCorrectWithConcatenation = 0;

  function checkTotal(total, current, index, numbers) {
    // console.log("checkTotal", index);
    if (total < current) {
      return false;
    }
    if (index === numbers.length) {
      return total === current;
    }
    return (
      checkTotal(total, current + numbers[index], index + 1, numbers) ||
      checkTotal(total, current * numbers[index], index + 1, numbers)
    );
  }

  function checkTotalWithConcatenation(total, current, index, numbers) {
    if (total < current) {
      return false;
    }

    if (index === numbers.length) {
      return total === current;
    }

    return (
      checkTotalWithConcatenation(
        total,
        current + numbers[index],
        index + 1,
        numbers
      ) ||
      checkTotalWithConcatenation(
        total,
        current * numbers[index],
        index + 1,
        numbers
      ) ||
      checkTotalWithConcatenation(
        total,
        Number(current.toString() + numbers[index].toString()),
        index + 1,
        numbers
      )
    );
  }

  const lines = data.split("\r\n");
  for (let i = 0; i < lines.length; i++) {
    const equation = lines[i].split(": ");
    const total = Number(equation[0]);
    const numbers = equation[1].split(" ").map((el) => Number(el));

    if (checkTotal(total, numbers[0], 1, numbers)) {
      totalCorrect += total;
    } else {
      if (checkTotalWithConcatenation(total, numbers[0], 1, numbers)) {
        totalCorrectWithConcatenation += total;
      }
    }
  }

  console.log("Total correct: ", totalCorrect);
  console.log(
    "Total correct with concatenation: ",
    totalCorrectWithConcatenation + totalCorrect
  );
});
