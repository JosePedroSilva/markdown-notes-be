const logger = require('../../logger');

const buildFolderTree = require('../utils/buildFolderTree');

const notesQueries = require('./queries/notesQueries');
const foldersQueries = require('./queries/foldersQueries');

exports.createNote = async (title, content, folderId, userId) => {
  try {
    const noteId = crypto.randomUUID();
    logger.trace('Creating note', { noteId, title, content, folderId, userId });

    const note = await notesQueries.createNote(noteId, title, content, userId, folderId);

    return note;
  } catch (err) {
    logger.error('Failed to create note', { error: err });
    throw err;
  }
};

exports.getNoteById = async (noteId, userId) => {
  try {
    const note = await notesQueries.getNoteById(noteId, userId);

    return note || null;
  } catch (err) {
    logger.error('Failed to get note', { error: err });
    throw err;
  }
};

exports.updateNote = async (noteId, title, content, folderId, userId) => {
  try {
    const result = await notesQueries.updateNote(noteId, title, content, folderId, userId);
    return result ? { message: 'Note updated' } : null;
  } catch (err) {
    logger.error('Failed to update note', { error: err });
    throw err;
  }
};

exports.deleteNote = async (noteId, userId) => {
  try {
    const result = await notesQueries.deleteNoteById(noteId, userId);
    return result ? { message: 'Note deleted' } : null;
  } catch (err) {
    logger.error('Failed to delete note', { error: err });
    throw err;
  }
};

exports.getAllNotesAndFoldersTree = async (userId) => {
  try {
    const notes = await notesQueries.getAllNotesByUserId(userId);
    logger.trace('Fetched notes for user', { userId, notesCount: notes.length });
    const folders = await foldersQueries.getFoldersByUserId(userId);
    logger.trace('Fetched folders for user', { userId, foldersCount: folders.length });

    const folderTree = buildFolderTree(folders, notes);

    return folderTree;
  } catch (err) {
    logger.error('Failed to get notes and folders tree', { error: err });
    throw err;
  }
};