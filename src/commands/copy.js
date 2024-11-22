const { gitCommand } = require("../core/git");
const { clearCopyFolder } = require("../core/folder");
const { log } = require("../utils/logger");
const fileHelper = require("../helpers/fileHelper");
const settings = require("../../config/settings");
const boxen = require("boxen");

async function copy(branchOrCommit, path) {
  await clearCopyFolder();
  const { exec } = require("child_process");

  process.chdir(path);
  const command = gitCommand(branchOrCommit);

  exec(command, async (error, stdout) => {
    if (error) {
      log.warn("No changes found.");
      return;
    }

    const files = stdout.split("\n").filter((file) => file !== "");

    if (files.length === 0) {
      log.info("No changes found.");
      return;
    }

    for (const file of files) {
      await fileHelper.copyFile(
        file,
        `${settings["upload-folder-name"]}/${file}`
      );
    }

    // Create a list of files for the box
    const fileList = files.map((file) => `- ${file}`).join("\n");

    // Display the files in a box
    const boxContent = boxen(
      `Copied the following ${files.length} file(s):\n\n${fileList}`,
      {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
      }
    );

    console.log(boxContent);
    log.success(`Copied ${files.length} files.`);
  });
}

module.exports = { copy };
