const fs = require('fs');
const path = require('path');
const stylesFolder = path.join(__dirname, 'styles');
const projectDist = path.join(__dirname, 'project-dist');
const bundleCSS = path.join(projectDist, 'bundle.css');

const filePath = path.join(__dirname, 'text.txt');

fs.writeFile(filePath, "", function(err){
  if (err) {
      console.log(err);
  }
});

fs.readdir(stylesFolder, {withFileTypes: true}, (error, files) => {
  if (error) throw error;
  for (const file of files) {
    if (file.isFile() && path.extname(file.name).slice(1) === 'css') {
      fs.readFile(path.join(stylesFolder, file.name), (error, data) => {
        if (error) throw error;
        fs.appendFile(bundleCSS, data, (error) => {
          if (error) throw error;
        });
      });
    }
  }
});