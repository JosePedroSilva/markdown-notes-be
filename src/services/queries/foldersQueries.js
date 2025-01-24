const { Folder, Note } = require('../../models');
const { Op } = require('sequelize');

exports.createFolder = async (folderId, name, userId, parentFolderId) => {
  const existingFolder = await Folder.findOne({
    where: {
      id: parentFolderId,
      user_id: userId,
      deleted: false,
    },
  });

  const folder = await Folder.create({
    id: folderId,
    name,
    userId: userId,
    parentFolderId: existingFolder ? parentFolderId : null,
  });

  return folder;
};

exports.updateFolder = async (folderId, name, userId, parentFolderId) => {
  const updateFields = {};
  if (name) updateFields.name = name;
  if (parentFolderId) updateFields.parentFolderId = parentFolderId;

  const folder = await Folder.update(updateFields, {
    where: {
      id: folderId,
      userId,
    },
  });

  if (folder[0] === 0) {
    throw new Error('Folder not found');
  }

  return folder;
};

exports.getFoldersByUserId = (userId) => {
  const folders = Folder.findAll({
    attributes: ['id', 'name', 'parent_folder_id'],
    where: {
      user_id: userId,
      deleted: false,
    },
  });

  return folders;
}

async function getDescendantFolderIds(folderId, userId, transaction) {
  let folderIds = [folderId];

  const subFolders = await Folder.findAll({
    where: {
      parent_folder_id: folderId,
      user_id: userId
    },
    attributes: ['id'],
    transaction
  });

  for (const subFolder of subFolders) {
    const descendantIds = await getDescendantFolderIds(subFolder.id, userId, transaction);
    folderIds = folderIds.concat(descendantIds);
  }

  return folderIds;
}

exports.markFolderAndContentsAsDeleted = async (folderId, userId) => {
  const initialFolder = await Folder.findOne({
    where: {
      id: folderId,
      user_id: userId,
      deleted: false,
    },
  });

  if (!initialFolder) {
    throw new Error('Folder not found');
  }

  const transaction = await Folder.sequelize.transaction();

  const folderIdsToMark = await getDescendantFolderIds(folderId, userId, transaction);

  await Folder.update(
    { deleted: true },
    {
      where: {
        id: {
          [Op.in]: folderIdsToMark,
        },
      },
      transaction: transaction
    }
  );

  await Note.update(
    { deleted: true },
    {
      where: {
        folder_id: {
          [Op.in]: folderIdsToMark,
        },
        user_id: userId
      },
      transaction: transaction
    }
  );

  await transaction.commit();

};
