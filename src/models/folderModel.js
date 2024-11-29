const dbAllPromise = require('../utils/dbAllPromise');

exports.getFoldersByUserId = (userId) => {
  const query = 'SELECT id, name, parent_folder_id FROM folders WHERE user_id = ?';
  return dbAllPromise(query, [userId]);
}

exports.createFolder = (folderId, name, userId, parentFolderId) => {
  const query = 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)';

  return dbAllPromise(query, [folderId, name, userId, parentFolderId]);
};

exports.updateFolder = (folderId, name, user_id, parentFolderId) => {
  const query = 'UPDATE folders SET name = ?, parent_folder_id = ? WHERE id = ? AND user_id = ?';

  return dbAllPromise(query, [name, parentFolderId, folderId, user_id]);
};