const logger = require('../../logger');
const responseErrorBuilder = require('../utils/responseErrorBuilder');
const responseSuccessBuilder = require('../utils/responseSuccessBuilder');
const notesService = require('../services/notesService');

exports.createNote = async (req, res) => {
  const { title, content, folderId } = req.body;

  if (typeof title !== 'string' || (content && typeof content !== 'string') || (folderId && typeof folderId !== 'string')) {
    logger.error('Invalid input type', { title, folderId });
    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Invalid input type',
      { title, content, folderId },
      req
    );
    return res.status(400).send(response);
  }

  const userId = req.user.id;
  logger.trace('Creating note', { title, content, folderId, userId });

  try {
    const result = await notesService.createNote(title, content, folderId, userId);
    logger.info('Note created', result);
    const response = new responseSuccessBuilder(
      'success',
      201,
      result,
      req
    );
    res.status(201).send(response);
  } catch (err) {
    logger.error('Failed to create note', { error: err });
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Failed to create note',
      {},
      req
    );
    return res.status(500).send(response);
  }
};

exports.getNote = async (req, res) => {
  const noteId = req.params.noteId;

  const userId = req.user.id;
  logger.trace('Fetching note', { noteId, userId });

  try {
    const result = await notesService.getNoteById(noteId, userId);
    logger.debug('Fetched note', result);

    // TODO: WIth new ORM this should not work test later
    if (!result) {
      logger.error('Note not found', { noteId });
      const response = new responseErrorBuilder(
        'error',
        404,
        'NOT_FOUND',
        'Note not found',
        { noteId },
        req
      );
      return res.status(404).send(response);
    }

    const response = new responseSuccessBuilder(
      'success',
      200,
      result,
      req
    );
    res.status(200).send(response);

  } catch (err) {
    logger.error('Failed to fetch note', { error: err });
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Failed to fetch note',
      {},
      req
    );
    return res.status(500).send(response);
  }
};

exports.updateNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, folderId } = req.body;

  if (!noteId) {
    logger.error('Note id not provided');
    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Note id not provided',
      {},
      req
    );
    return res.status(400).send(response);
  }

  if ((title && typeof title !== 'string') ||
    (content && typeof content !== 'string') ||
    (folderId && typeof folderId !== 'string')) {
    logger.error('Invalid input type', { title, content, folderId });
    const response = new responseErrorBuilder(
      'error',
      400,
      'BAD_REQUEST',
      'Invalid input type',
      { title, content, folderId },
      req
    );
    return res.status(400).send(response);
  };

  const userId = req.user.id;
  logger.trace('Updating note', { noteId, title, content, folderId, userId });

  try {
    const result = await notesService.updateNote(noteId, title, content, folderId, userId);
    logger.info('Note updated', result);
    const response = new responseSuccessBuilder(
      'success',
      200,
      result,
      req
    );
    res.status(200).send(response);
  } catch (err) {
    logger.error('Failed to update note', { error: err });
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Failed to update note',
      {},
      req
    );
    return res.status(500).send(response);
  }
};

exports.deleteNote = async (req, res) => {
  const noteId = req.params.noteId;
  const userId = req.user.id;
  logger.trace('Deleting note', { noteId, userId });

  try {
    await notesService.deleteNote(noteId, userId);
    logger.info('Note deleted', { noteId, userId });
    const response = new responseSuccessBuilder(
      'success',
      200,
      {},
      req
    );
    return res.status(200).send(response);
  } catch (err) {
    logger.error('Failed to delete note', { error: err });
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Failed to delete note',
      {},
      req
    );
    return res.status(500).send(response);
  }
};

// Returns the base folder and notes tree, note that it does not return the content of the notes
exports.getAllNotesOverview = async (req, res) => {
  const userId = req.user.id;

  logger.trace('Fetching notes for user', { userId });

  try {
    const result = await notesService.getAllNotesAndFoldersTree(userId);

    logger.debug('Folder tree', result);
    const response = new responseSuccessBuilder(
      'success',
      200,
      result,
      req
    );
    return res.status(200).send(response);

  } catch (err) {
    logger.error('Failed to fetch notes', { error: err });
    const response = new responseErrorBuilder(
      'error',
      500,
      'INTERNAL_SERVER_ERROR',
      'Failed to fetch notes',
      {},
      req
    );
    return res.status(500).send(response);
  }
}
