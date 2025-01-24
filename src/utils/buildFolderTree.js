const buildFolderTree = (folders, notes) => {

  const buildSubTree = (parentId) => {
    const children = folders.filter(f => f.parent_folder_id === parentId);
    const folderNotes = notes.filter(n => n.folderId === parentId);

    if (parentId === null) {
      return {
        id: 0,
        name: 'Root',
        children: children.map(child => buildSubTree(child.id)),
        notes: notes.filter(n => n.folderId === null)
      };
    }

    const folder = folders.find(f => f.id === parentId);
    return {
      id: folder.id,
      name: folder.name,
      children: children.map(child => buildSubTree(child.id)),
      ...(folderNotes.length > 0 && { notes: folderNotes })
    };
  };

  return buildSubTree(null);
};

module.exports = buildFolderTree;
