const dbAllPromise = require('../utils/dbAllPromise');

exports.createNote = (noteId, title, folderId, userId) => {
  const query = 'INSERT INTO notes (id, title, folder_Id, user_Id) VALUES (?, ?, ?, ?)';

  //TODO: Handle the folder id
  return dbAllPromise(query, [noteId, title, folderId, userId]);
}

exports.getAllNotesByUserId = (userId) => {
  const query = 'SELECT id, title, folder_id, created_at, updated_at FROM notes WHERE user_id = ?';

  return dbAllPromise(query, [userId]);
}