const logger = require('../../logger');

const folderModel = require('../models/folderModel');

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
    await folderModel.createFolder(folderId, name, userId, parentFolderId);
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
    await folderModel.updateFolder(folderId, name, userId, parentFolderId);
    logger.info('Folder updated', { folderId, name, parentFolderId, userId });
    res.status(200).send('Folder updated');
  } catch (err) {
    logger.error('Failed to update folder', { error: err });
    return res.status(500).send('Failed to update folder');
  }
};