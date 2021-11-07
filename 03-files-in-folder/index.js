const path = require('path');
const pathDirectory = path.join(__dirname, '/secret-folder');
const fs = require('fs');


fs.readdir(pathDirectory, {withFileTypes: true}, (error, myDir) => {
  if (error) {
    console.error(error);
  } else {
    for (let i = 0; i < myDir.length; i++) {
      fs.stat(`${pathDirectory}/${myDir[i].name}`, (error, stats) => {
        if (error) {
          console.error(error);
        } else {
          if (myDir[i].isFile()) {
            const file = myDir[i].name.split('.');
            console.log(`${file[0]} - ${file[1]} - ${stats.size} bytes`);
          }
        }
      });
    }
  }
});