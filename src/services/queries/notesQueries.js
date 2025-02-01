const { Note } = require('../../models');
const { getFolderById } = require('./foldersQueries');

exports.createNote = async (noteId, title, content, userId, folderId) => {
  const validFolderId = folderId && (await getFolderById(folderId, userId)) ? folderId : null;

  const note = await Note.create({
    id: noteId,
    title,
    content,
    user_id: userId,
    folderId: validFolderId,
  });

  return note;
};

exports.getAllNotesByUserId = async (userId) => {
  const notes = await Note.findAll({
    attributes: ['id', 'title', 'folderId', 'createdAt', 'updatedAt'],
    where: {
      user_id: userId,
      deleted: false,
    },
  });

  const plainNotes = notes.map(note => note.get({ plain: true }));

  return plainNotes;
};

exports.getNoteById = (noteId, userId) => {
  const note = Note.findOne({
    attributes: ['id', 'title', 'folderId', 'content', 'createdAt', 'updatedAt'],
    where: {
      id: noteId,
      user_id: userId,
      deleted: false,
    },
  });

  return note;
}

exports.updateNote = async (noteId, title, content, folderId, userId) => {
  const updateFields = {};
  if (title) updateFields.title = title;
  if (content) updateFields.content = content;
  if (folderId) updateFields.folderId = folderId;

  const note = await Note.update(updateFields, {
    where: {
      id: noteId,
      user_id: userId,
    },
  });

  if (note[0] === 0) {
    throw new Error('Note not found');
  }

  return note;
};

exports.deleteNoteById = async (noteId, userId) => {
  const note = await Note.update({ deleted: true }, {
    where: {
      id: noteId,
      user_id: userId,
    },
  });

  if (note[0] === 0) {
    throw new Error('Note not found');
  }

  return note;
};