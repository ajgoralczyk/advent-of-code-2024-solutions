import { data } from "./data.js";

const firstList = data.map((el) => el[0]).sort((a, b) => a - b);
const secondList = data.map((el) => el[1]).sort((a, b) => a - b);
let distance = 0;
for (let i = 0; i < firstList.length; i++) {
  distance += Math.abs(firstList[i] - secondList[i]);
}

console.log("Distance", distance);

let similarity = 0;
const appearances = {};
for (let i = 0; i < secondList.length; i++) {
  appearances[secondList[i]] = appearances[secondList[i]] + 1 || 1;
}
for (let i = 0; i < firstList.length; i++) {
  if (appearances[firstList[i]]) {
    similarity += firstList[i] * appearances[firstList[i]];
  }
}

console.log("Similarity", similarity);
