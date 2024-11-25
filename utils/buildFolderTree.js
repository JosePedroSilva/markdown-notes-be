// TODO: Thought about the json structure and the possibility to add the folders to the root as children
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