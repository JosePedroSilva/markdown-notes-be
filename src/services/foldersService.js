const logger = require('../../logger');

const foldersQueries = require('./queries/foldersQueries');

exports.createFolder = async (name, parentFolderId, userId) => {
  try {
    const folderId = crypto.randomUUID();
    logger.trace('Generated folder ID', { folderId });

    const folder = await foldersQueries.createFolder(folderId, name, userId, parentFolderId);
    return folder;
  } catch (err) {
    logger.error('Failed to create folder', err);
    throw new Error('Failed to create folder');
  }
};

exports.updatefolder = async (folderId, name, parentFolderId, userId) => {
  try {
    const result = await foldersQueries.updateFolder(folderId, name, userId, parentFolderId);

    if (result === 0) {
      throw new Error('Folder not found');
    }

    return { message: 'Folder updated successfully' };
  } catch (err) {
    if (err.message === 'Folder not found') {
      logger.error('Folder not found', { folderId });
      throw new Error('Folder not found');
    }
    logger.error('Failed to update folder', err);
    throw new Error('Failed to update folder');
  }
};

exports.deleteFolder = async (folderId, userId) => {
  try {
    const result = await foldersQueries.markFolderAndContentsAsDeleted(folderId, userId);

    if (result === 0) {
      throw new Error('Folder not found');
    }

    return { message: 'Folder deleted successfully' };
  } catch (err) {
    if (err.message === 'Folder not found') {
      logger.error('Folder not found', { folderId });
      throw new Error('Folder not found');
    }
    logger.error('Failed to delete folder', err);
    throw new Error('Failed to delete folder');
  }
};