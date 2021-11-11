const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
const stylesOld = path.join(__dirname, "styles");
const assetsOld = path.join(__dirname, "assets");
const componentsOld = path.join(__dirname, "components");
const templatesSource = path.join(__dirname, "template.html");
const newPath = path.join(__dirname, "project-dist");
const newStylesPath = path.join(newPath, "style.css");
const newAssetsPath = path.join(newPath, "assets");
let dirHave = false;

fsPromises.mkdir(newPath, { recursive: true });

async function addIndexHTML() {
  const regStr = new RegExp(/{{\w+}}/g);
  const temp = fsPromises.readFile(templatesSource, "utf-8");
  const components = (await temp).match(regStr);
  let tempStr = await temp;
  for (let i = 0; i < components.length; i++) {
    const replacer = await fsPromises.readFile(
      path.join(
        componentsOld,
        `${components[i].replace("{{", "").replace("}}", "")}.html`
      ),
      "utf-8"
    );
    tempStr = tempStr.replace(components[i], replacer);
    await fsPromises.writeFile(
      path.join(newPath, "index.html"),
      tempStr,
      "utf-8"
    );
  }
}

async function addStyleCSS() {
  const styles = await fsPromises.readdir(stylesOld, { withFileTypes: true });
  for (let i = 0; i < styles.length; i++) {
    if (styles[i].isFile() && path.extname(styles[i].name).slice(1) === "css") {
      fs.readFile(path.join(stylesOld, styles[i].name), (error, data) => {
        if (error) throw error;
        fs.appendFile(newStylesPath, data, (error) => {
          if (error) throw error;
        });
      });
    }
  }
}

async function copyFilesInNewDir() {
  if (dirHave) {
    await fsPromises.rm(newAssetsPath, { recursive: true });
  }
  await fsPromises.mkdir(newAssetsPath, { recursive: true });
  fs.readdir(assetsOld, (error, files) => {
    if (error) throw error;
    for (let i = 0; i < files.length; i++) {
      const newDir = path.join(path.join(assetsOld, files[i]));
      fs.mkdir(
        path.join(newAssetsPath, files[i]),
        { recursive: true },
        (error) => {
          if (error) throw error;
        }
      );
      fs.readdir(newDir, (error, nestedFiles) => {
        for (const file of nestedFiles) {
          if (error) throw error;
          const input = fs.createReadStream(path.join(newDir, file));
          const output = fs.createWriteStream(
            path.join(newAssetsPath, files[i], file),
            { autoClose: true }
          );
          input.pipe(output);
        }
      });
    }
  });
}

function funDirHave() {
  fs.stat(newAssetsPath, (error) => {
    if (!error) {
      dirHave = true;
      copyFilesInNewDir();
    } else {
      dirHave = false;
      copyFilesInNewDir();
    }
  });
}

addIndexHTML();
addStyleCSS();
funDirHave();
