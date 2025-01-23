const logger = require('../../logger');

const foldersQueries = require('../services/queries/foldersQueries');

exports.createFolder = async (req, res) => {
  const { name, parentFolderId } = req.body;

  if (typeof name !== 'string') {
    logger.error('Invalid input type', { name, parentFolderId });
    return res.status(400).send('Invalid input type');
  }

  if (!req.user) {
    logger.error('User not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userId = req.user.id;
  logger.trace('Creating folder', { name, parentFolderId, userId });

  const folderId = crypto.randomUUID();

  try {
    await foldersQueries.createFolder(folderId, name, userId, parentFolderId);
    logger.info('Folder created', { name, parentFolderId, userId });
    res.status(201).send('Folder created');
  } catch (err) {
    logger.error('Failed to create folder', { error: err });
    return res.status(500).send('Failed to create folder');
  }
}

exports.updateFolder = async (req, res) => {
  const { folderId } = req.params;
  const { name, parentFolderId } = req.body;

  if (!folderId) {
    logger.error('Folder ID not provided');
    return res.status(400).send('Folder ID not provided');
  }

  if (!name && !parentFolderId) {
    logger.error('No update fields provided');
    return res.status(400).send('No update fields provided');
  }

  if (typeof name !== 'string') {
    logger.error('Invalid input type', { name, parentFolderId });
    return res.status(400).send('Invalid input type');
  }

  if (!req.user) {
    logger.error('User not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userId = req.user.id;
  logger.trace('Updating folder', { folderId, name, parentFolderId, userId });

  try {
    await foldersQueries.updateFolder(folderId, name, userId, parentFolderId);
    logger.info('Folder updated', { folderId, name, parentFolderId, userId });
    res.status(200).send('Folder updated');
  } catch (err) {
    if (err.message === 'Folder not found') {
      logger.warn('Folder not found', { folderId, userId });
      return res.status(404).send('Folder not found');
    }
    logger.error('Failed to update folder', { error: err });
    return res.status(500).send('Failed to update folder');
  }
};

exports.deleteFolder = async (req, res) => {
  const { folderId } = req.params;

  if (!folderId) {
    logger.error('Folder ID not provided');
    return res.status(400).send('Folder ID not provided');
  }

  if (!req.user) {
    logger.error('User not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userId = req.user.id;
  logger.trace('Deleting folder', { folderId, userId });

  try {
    await foldersQueries.markFolderAndContentsAsDeleted(folderId, userId);
    logger.info('Folder and contents marked as deleted', { folderId, userId });
    res.status(200).send('Folder deleted');
  } catch (err) {
    logger.error('Failed to delete folder', { error: err });
    return res.status(500).send('Failed to delete folder');
  }
};