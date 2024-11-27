// {
//   "id": 0,
//   "name": "Root",
//   "children": [
//     {
//       "id": 2,
//       "name": "Folder 1",
//       "children": [
//         {
//           "id": 3,
//           "name": "Folder 2",
//           "notes": [
//             {
//               "id": 1,
//               "title": "Note 1",
//               "folder_id": 3
//             }
//           ]
//         }
//       ],
//       "notes": [
//         {
//           "id": 2,
//           "title": "Note 2",
//           "folder_id": 2
//         }
//       ]
//     }
//   ],
//  "notes": [
//    {
//      "id": 3,
//      "title": "Note 3",
//      "folder_id": null
//    }
//  ]
// }

const buildFolderTree = (folders, notes) => {
  const folderTree = [];
  const rootFolder = {
    id: null,
    name: 'Root',
  }

  folders.forEach(folder => {
    if (!folder.parent_folder_id) {
      folderTree.push(folder);
    }

    // TODO: Review this part, not sure if it's correct
    if (folder.parent_folder_id) {
      const parentFolder = folderTree.find(f => f.id === folder.parent_folder_id);
      if (parentFolder) {
        parentFolder.children = parentFolder.children || [];
        parentFolder.children.push(folder);
      }
    }
  });

  notes.forEach(note => {
    const folder = folderTree.find(f => f.id === note.folder_id);
    if (folder) {
      folder.notes = folder.notes || [];
      folder.notes.push(note);
    }

    if (!folder) {
      rootFolder.notes = rootFolder.notes || [];
      rootFolder.notes.push(note);
    }
  });

  folderTree.push(rootFolder);

  return folderTree;
};

module.exports = buildFolderTree;