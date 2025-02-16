const logger = require('../../logger');

const buildFolderTree = require('../utils/buildFolderTree');

const notesQueries = require('./queries/notesQueries');
const foldersQueries = require('./queries/foldersQueries');

exports.createNote = async (title, content, folderId, userId) => {
  const noteId = crypto.randomUUID();
  logger.trace('Creating note', { noteId, title, content, folderId, userId });

  const note = await notesQueries.createNote(noteId, title, content, userId, folderId);

  return note;
};

exports.getNoteById = async (noteId, userId) => {
  const note = await notesQueries.getNoteById(noteId, userId);
  return note;
};

exports.updateNote = async (noteId, title, content, folderId, userId) => {
  const existingNote = await notesQueries.getNoteById(noteId, userId);

  if (!existingNote) {
    throw new Error('Note not found');
  }

  await notesQueries.updateNote(noteId, title, content, folderId, userId);
  return { message: 'Note updated' };
};

exports.deleteNote = async (noteId, userId) => {
  const existingNote = await notesQueries.getNoteById(noteId, userId);

  if (!existingNote) {
    throw new Error('Note not found');
  }

  await notesQueries.deleteNoteById(noteId, userId);
  return { message: 'Note deleted' };
};

exports.getAllNotesAndFoldersTree = async (userId) => {
  const notes = await notesQueries.getAllNotesByUserId(userId);
  logger.trace('Fetched notes for user', { userId, notesCount: notes.length });
  const folders = await foldersQueries.getFoldersByUserId(userId);
  logger.trace('Fetched folders for user', { userId, foldersCount: folders.length });

  const folderTree = buildFolderTree(folders, notes);

  return folderTree;
};