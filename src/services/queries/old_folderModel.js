// const dbAllPromise = require('../../utils/dbAllPromise');

// exports.getFoldersByUserId = (userId) => {
//   const query = 'SELECT id, name, parent_folder_id FROM folders WHERE user_id = ? AND deleted = FALSE';
//   return dbAllPromise(query, [userId]);
// }

// exports.createFolder = (folderId, name, userId, parentFolderId) => {
//   const query = 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)';

//   return dbAllPromise(query, [folderId, name, userId, parentFolderId]);
// };

// exports.updateFolder = (folderId, name, user_id, parentFolderId) => {
//   const query = 'UPDATE folders SET name = ?, parent_folder_id = ? WHERE id = ? AND user_id = ?';

//   return dbAllPromise(query, [name, parentFolderId, folderId, user_id]);
// };

// exports.markFolderAndContentsAsDeleted = async (folderId, userId) => {
//   const query = `
//     WITH RECURSIVE
//     folder_tree AS (
//       SELECT id FROM folders
//       WHERE id = ? AND user_id = ?

//       UNION ALL

//       SELECT f.id
//       FROM folders f
//       INNER JOIN folder_tree ft ON f.parent_folder_id = ft.id
//     )
//     UPDATE folders
//     SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP
//     WHERE id IN (SELECT id FROM folder_tree);
//   `;

//   const notesQuery = `
//     UPDATE notes
//     SET deleted = TRUE, updated_at = CURRENT_TIMESTAMP
//     WHERE folder_id IN (
//       SELECT id FROM folders
//       WHERE deleted = TRUE AND user_id = ?
//     );
//   `;

//   return Promise.all([
//     dbAllPromise(query, [folderId, userId]),
//     dbAllPromise(notesQuery, [userId])
//   ]);
// };