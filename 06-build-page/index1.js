const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const componentsOld = path.join(__dirname, 'components');
const templatesOld = path.join(__dirname, 'template.html');
const stylesOld = path.join(__dirname, 'styles');
const assetsOld = path.join(__dirname, 'assets');
const newPath = path.join(__dirname, 'project-dist');

fsPromises.mkdir(newPath, {recursive: true});

async function addIndexHTML() {
  const regStr = new RegExp(/{{\w+}}/g);
  const temp = fsPromises.readFile(templatesOld, 'utf-8');
  const components = (await temp).match(regStr);
  let tempStr = await temp;
  for (let i = 0; i < components.length; i++) {
    const replacer = await fsPromises.readFile(path.join(componentsOld, `${components[i].replace('{{', '').replace('}}', '')}.html`), 'utf-8');
    tempStr = tempStr.replace(components[i], replacer);
    await fsPromises.writeFile(path.join(newPath, 'index.html'), tempStr, 'utf-8');
  }
}

async function addStyleCSS() {
  const styles = await fsPromises.readdir(stylesOld, {withFileTypes: true});
  for (let i = 0; i < styles.length; i++) {
    if (styles[i].isFile() && path.extname(styles[i].name).slice(1) === 'css') {
      fs.readFile(path.join(stylesOld, styles[i].name), (error, data) => {
        if (error) throw error;
        fs.appendFile(path.join(newPath, 'style.css'), data, (error) => {
          if (error) throw error;
        });
      });
    }
  }
}

const destStylesPath = path.join(newPath, 'style.css');
const destAssetsPath = path.join(newPath, 'assets');

async function copyFilesInNewDir() {
  await fsPromises.rmdir(destAssetsPath, {recursive: true});
  await fsPromises.mkdir(destAssetsPath, {recursive: true});
  fs.readdir(assetsOld, (error, files) => {
    if (error) throw error;
    for (let i = 0; i < files.length; i++) {
      const newDir = path.join(path.join(assetsOld, files[i]));
      fs.mkdir(path.join(path.join(newPath, 'assets'), files[i]), {recursive: true}, (error) => {
        if (error) throw error;
      });
      fs.readdir(newDir, (error, nestedFiles) => {
        for (let i = 0; i < nestedFiles.length; i++) {
          if (error) throw error;
          const input = fs.createReadStream(path.join(newDir, nestedFiles[i]));
          const output = fs.createWriteStream(path.join(destAssetsPath, files[i], nestedFiles[i]), {autoClose: true});
          input.pipe(output);
        }
      });
    }
  });
}

addIndexHTML();
addStyleCSS();
copyFilesInNewDir();