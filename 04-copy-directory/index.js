const fsProm = require("fs/promises");
const path = require("path");
const files = path.join(__dirname, "files");
const filesCopy = path.join(__dirname, "files-copy");

async function mkCopyDir() {
  await fsProm.rmdir(filesCopy, { recursive: true });
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

mkCopyDir();