const logger = require('../../logger');
const responseErrorBuilder = require('../utils/responseErrorBuilder');
const responseSuccessBuilder = require('../utils/responseSuccessBuilder');
const foldersService = require('../services/foldersService');

exports.createFolder = async (req, res) => {
  const { name, parentFolderId } = req.body;

  if (typeof name !== 'string' || (parentFolderId && typeof parentFolderId !== 'string')) {
    logger.error('Invalid input type', { name, parentFolderId });

    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Invalid input type',
      { name, parentFolderId },
      req
    );

    return res.status(400).send(response);
  }

  if (!req.user) {
    logger.error('User not authenticated');
    const response = new responseErrorBuilder(
      'error',
      401,
      'UNAUTHORIZED',
      'User not authenticated',
      {},
      req
    )
    return res.status(401).send(response);
  }

  const userId = req.user.id;
  logger.trace('Creating folder', { name, parentFolderId, userId });

  try {
    const result = await foldersService.createFolder(name, parentFolderId, userId);
    logger.info('Folder created', result);
    const response = new responseSuccessBuilder(
      'success',
      201,
      result,
      req
    );
    res.status(201).send(response);
  } catch (err) {
    logger.error('Failed to create folder', err);
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Failed to create folder',
      {},
      req
    );
    return res.status(500).send(response);
  }
}

exports.updateFolder = async (req, res) => {
  const { folderId } = req.params;
  const { name, parentFolderId } = req.body;

  if (!folderId) {
    logger.error('Folder ID not provided');
    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Folder ID not provided',
      {},
      req
    );
    return res.status(400).send(response);
  }

  if (!name) {
    logger.error('No update fields provided');
    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'No update fields provided',
      {},
      req
    );
    return res.status(400).send(response);
  }

  if (typeof name !== 'string' || (parentFolderId && typeof parentFolderId !== 'string')) {
    logger.error('Invalid input type', { name, parentFolderId });
    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Invalid input type',
      { name, parentFolderId },
      req
    );
    return res.status(400).send(response);
  }

  if (!req.user) {
    logger.error('User not authenticated');
    const response = new responseErrorBuilder(
      'error',
      401,
      'UNAUTHORIZED',
      'User not authenticated',
      {},
      req
    )
    return res.status(401).send(response);
  }

  const userId = req.user.id;
  logger.trace('Updating folder', { folderId, name, parentFolderId, userId });

  try {
    const result = await foldersService.updatefolder(folderId, name, parentFolderId, userId);
    logger.info('Folder updated', result);
    const response = new responseSuccessBuilder(
      'success',
      200,
      result,
      req
    );
    res.status(200).send(response);
  } catch (err) {
    if (err.message === 'Folder not found') {
      logger.warn('Folder not found', { folderId, userId });
      const response = new responseErrorBuilder(
        'error',
        404,
        'NOT_FOUND',
        'Folder not found',
        { folderId },
        req
      );
      return res.status(404).send(response);
    }
    logger.error('Failed to update folder', { error: err });
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Failed to update folder',
      {},
      req
    );
    return res.status(500).send(response);
  }
};

exports.deleteFolder = async (req, res) => {
  const { folderId } = req.params;

  if (!folderId) {
    logger.error('Folder ID not provided');
    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Folder ID not provided',
      {},
      req
    );
    return res.status(400).send(response);
  }

  if (!req.user) {
    logger.error('User not authenticated');
    const response = new responseErrorBuilder(
      'error',
      401,
      'UNAUTHORIZED',
      'User not authenticated',
      {},
      req
    )
    return res.status(401).send(response);
  }

  const userId = req.user.id;
  logger.trace('Deleting folder', { folderId, userId });

  try {
    const result = await foldersService.deleteFolder(folderId, userId);
    logger.info('Folder and contents marked as deleted', result);
    const response = new responseSuccessBuilder(
      'success',
      200,
      result,
      req
    );
    res.status(200).send(response);
  } catch (err) {
    if (err.message === 'Folder not found') {
      logger.warn('Folder not found', { folderId, userId });
      const response = new responseErrorBuilder(
        'error',
        404,
        'NOT_FOUND',
        'Folder not found',
        { folderId },
        req
      );
      return res.status(404).send(response);
    }
    logger.error('Failed to delete folder', { error: err });
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Failed to delete folder',
      {},
      req
    );
    return res.status(500).send(response);
  }
};