const buildFolderTree = (folders, notes) => {
    const folderTree = [];

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
    });

    return folderTree;
};

module.exports = buildFolderTree;