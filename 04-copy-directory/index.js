const fsProm = require("fs/promises");
const path = require("path");
const files = path.join(__dirname, "files");
const filesCopy = path.join(__dirname, "files-copy");
const fs = require("fs");
let dirHave = false;

function funDirHave() {
  fs.stat(filesCopy, (error) => {
    if (!error) {
      dirHave = true;
      mkCopyDir();
    } else {
      dirHave = false;
      mkCopyDir();
    }
  });
}

async function mkCopyDir() {
  if (dirHave) {
    await fsProm.rm(filesCopy, { recursive: true });
  }

  await fsProm.mkdir(filesCopy, { recursive: true });
  const filesObj = await fsProm.readdir(files, { withFileTypes: true });
  for (let i = 0; i < filesObj.length; i++) {
    if (filesObj[i].isFile()) {
      await fsProm.copyFile(
        path.join(files, filesObj[i].name),
        path.join(filesCopy, filesObj[i].name)
      );
    }
  }
}

funDirHave();