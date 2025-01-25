const logger = require('../../logger');

const foldersQueries = require('./queries/foldersQueries');

exports.createFolder = async (name, parentFolderId, userId) => {
  const folderId = crypto.randomUUID();
  logger.trace('Generated folder ID', { folderId });

  const folder = await foldersQueries.createFolder(folderId, name, userId, parentFolderId);
  return folder;
};

exports.updatefolder = async (folderId, name, parentFolderId, userId) => {

  const result = await foldersQueries.updateFolder(folderId, name, userId, parentFolderId);

  if (result === 0) {
    throw new Error('Folder not found');
  }

  return { message: 'Folder updated successfully' };

};

exports.deleteFolder = async (folderId, userId) => {
  await foldersQueries.markFolderAndContentsAsDeleted(folderId, userId);

  return { message: 'Folder deleted successfully' };
};