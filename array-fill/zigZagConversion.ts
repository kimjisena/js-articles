import CustomArray from "./custom-class";

function zigZagConversion (str: string, numRows: number) {

  if (numRows === 1) {
    return str;
  }

  let rows = new CustomArray(numRows);
  rows.fillUnique([]);

  let currentRow = 0;
  let delta = 1;

  for (let i = 0; i < str.length; i++) {

    if (currentRow === 0) {
      delta = 1;
    } else if (currentRow === rows.length - 1) {
      delta = -1;
    }

    rows[currentRow].push(str[i]);
    currentRow += delta;
  }

  return rows;
}

console.log(zigZagConversion('PAYPALISHIRING', 3));
