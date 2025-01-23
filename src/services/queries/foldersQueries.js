const { Folder } = require('../../models');

exports.createFolder = async (folderId, name, userId, parentFolderId) => {
  console.log('Creating folder', { folderId, name, userId, parentFolderId });
  const folder = await Folder.create({
    id: folderId,
    name,
    userId: userId,
    parentFolderId: parentFolderId,
  });

  return folder;
};

exports.updateFolder = async (folderId, name, userId, parentFolderId) => {
  const updateFields = {};
  if (name) updateFields.name = name;
  if (parentFolderId) updateFields.parentFolderId = parentFolderId;

  console.log('Updating folder', { folderId, name, userId, parentFolderId });
  const folder = await Folder.update(updateFields, {
    where: {
      id: folderId,
      userId,
    },
  });

  console.log('folder updated', folder);
  if (folder[0] === 0) {
    throw new Error('Folder not found');
  }

  return folder;
};
