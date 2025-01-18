// const dbAllPromise = require('../../utils/dbAllPromise');

// exports.createNote = (noteId, title, content, folderId, userId) => {
//   const query = 'INSERT INTO notes (id, title, content, folder_Id, user_Id) VALUES (?, ?, ?, ?, ?)';

//   //TODO: Handle the folder id
//   return dbAllPromise(query, [noteId, title, content, folderId, userId]);
// }

// exports.getAllNotesByUserId = (userId) => {
//   const query = 'SELECT id, title, folder_id, created_at, updated_at FROM notes WHERE user_id = ? AND deleted = FALSE';

//   return dbAllPromise(query, [userId]);
// }

// exports.getNoteById = (noteId, userId) => {
//   const query = 'SELECT id, title, folder_id, content, created_at, updated_at FROM notes WHERE id = ? AND user_id = ?';

//   return dbAllPromise(query, [noteId, userId]);
// }

// exports.updateNote = (noteId, title, content, folderId, userId) => {
//   const query = 'UPDATE notes SET title = ?, content = ?, folder_id = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?';

//   return dbAllPromise(query, [title, content, folderId, noteId, userId]);
// }

// exports.deleteNoteById = (noteId, userId) => {
//   // Make it a soft delete
//   const query = 'UPDATE notes SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?';

//   return dbAllPromise(query, [noteId, userId]);
// };