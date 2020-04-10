const fileDropContainer = document.querySelector(".drop_container");
fileDropContainer.ondragover = function (e) {
  e.preventDefault();
};
const allFiles = [];
fileDropContainer.ondrop = function (e) {
  e.stopPropagation();
  e.preventDefault();
  
  const droppedItems = e.dataTransfer.items;
  for (const item of droppedItems) {
    if (item.kind != "file") {
      continue;
    }
    const entry = item.webkitGetAsEntry();
    const allDroppedFiles = getDroppedFiles(entry);
    console.log(allDroppedFiles);
  }
};

function getDroppedFiles(droppedEntry) {
  const droppedFiles = [];
  if (droppedEntry.isFile) {
    droppedEntry.file((file) => {
      droppedFiles.push(file);
    });
  } else {
    readDroppedFiles(droppedEntry);
  }
  function readDroppedFiles(entry) {
    readAllDirectoryEntries(entry).then((allEntries) => {
      allEntries.forEach((innerEntry) => {
        if (innerEntry.isFile) {
          innerEntry.file((file) => {
            droppedFiles.push(file);
          });
        } else if (innerEntry.isDirectory) {
          readDroppedFiles(innerEntry);
        }
      });
    });
  }
  return droppedFiles;
  function readAllDirectoryEntries(directoryEntry) {
    return new Promise((resolve) => {
      const directoryEntries = [];
      const directoryReader = directoryEntry.createReader();
      readEntries();
      function readEntries() {
        directoryReader.readEntries(function (entries) {
          entries.forEach((entry) => {
            directoryEntries.push(entry);
          });
          if (entries.length != 0) {
            readEntries();
          } else {
            resolve(directoryEntries);
          }
        });
      }
    });
  }
}
