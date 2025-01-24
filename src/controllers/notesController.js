const logger = require('../../logger');

const notesService = require('../services/notesService');

exports.createNote = async (req, res) => {
  const { title, content, folderId } = req.body;

  if (typeof title !== 'string') {
    logger.error('Invalid input type', { title, folderId });
    return res.status(400).send('Invalid input type');
  }

  if (!req.user) {
    logger.error('User not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userId = req.user.id;
  logger.trace('Creating note', { title, content, folderId, userId });

  try {
    const result = await notesService.createNote(title, content, folderId, userId);
    logger.info('Note created', result);
    res.status(201).send(result);
  } catch (err) {
    logger.error('Failed to create note', { error: err });
    return res.status(500).send('Failed to create note');
  }
};

exports.getNote = async (req, res) => {
  const noteId = req.params.noteId;

  if (typeof noteId !== 'string') {
    logger.error('Invalid input type', { noteId });
    return res.status(400).send('Invalid input type');
  }

  if (!req.user) {
    logger.error('User not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userId = req.user.id;
  logger.trace('Fetching note', { noteId, userId });

  try {
    const result = await notesService.getNoteById(noteId, userId);
    logger.debug('Fetched note', result);

    // TODO: WIth new ORM this should not work test later
    if (!result) {
      logger.error('Note not found', { noteId });
      return res.status(404).send('Note not found');
    }
    res.status(200).send(result);

  } catch (err) {
    logger.error('Failed to fetch note', { error: err });
    return res.status(500).send('Failed to fetch note');
  }
};

exports.updateNote = async (req, res) => {
  const noteId = req.params.noteId;
  const { title, content, folderId } = req.body;

  if (typeof noteId !== 'string') {
    logger.error('Invalid input type', { noteId });
    return res.status(400).send('Invalid input type');
  }

  if (!req.user) {
    logger.error('User not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userId = req.user.id;
  logger.trace('Updating note', { noteId, title, content, folderId, userId });

  try {
    const result = await notesService.updateNote(noteId, title, content, folderId, userId);
    logger.info('Note updated', result);
    res.status(200).send('Note updated');
  } catch (err) {
    logger.error('Failed to update note', { error: err });
    return res.status(500).send('Failed to update note');
  }
};

exports.deleteNote = async (req, res) => {
  const noteId = req.params.noteId;

  if (typeof noteId !== 'string') {
    logger.error('Invalid input type', { noteId });
    return res.status(400).send('Invalid input type');
  }

  if (!req.user) {
    logger.error('User not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userId = req.user.id;
  logger.trace('Deleting note', { noteId, userId });

  try {
    await notesService.deleteNote(noteId, userId);
    logger.info('Note deleted', { noteId, userId });
    res.status(200).send('Note deleted');
  } catch (err) {
    logger.error('Failed to delete note', { error: err });
    return res.status(500).send('Failed to delete note');
  }
};

// Returns the base folder and notes tree, note that it does not return the content of the notes
exports.getAllNotesOverview = async (req, res) => {
  if (!req.user) {
    logger.error('User not authenticated');
    return res.status(401).send('User not authenticated');
  }

  const userId = req.user.id;

  logger.trace('Fetching notes for user', { userId });

  try {
    const result = await notesService.getAllNotesAndFoldersTree(userId);

    logger.debug('Folder tree', result);
    res.status(200).send(result);

  } catch (err) {
    logger.error('Failed to fetch notes', { error: err });
    return res.status(500).send('Failed to fetch notes');
  }
}
