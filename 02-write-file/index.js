const fs = require('fs');
const path = require('path');
const process = require('process');
const readline = require('readline');
const filePath = path.join(__dirname, 'data.txt');
let writeStr = new fs.createWriteStream(filePath, {encoding: 'utf8'});

const readLine = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
readLine.question('Enter text: ', answer => {
  if (answer === 'exit') {
    readLine.close();
    stdout.write('See you!');
  } else {
    writeStr.write(`${answer} + \n`);
  }
  readLine.on('line', input => {
    if (input === 'exit') {
      readLine.close();
    } else {
      writeStr.write(`${input} + \n`);
    }
  });
  readLine.on('close', () => {
    process.stdout.write('See you!');
  });
});