const dbAllPromise = require('../utils/dbAllPromise');

exports.getFoldersByUserId = (userId) => {
  const query = 'SELECT id, name, parent_folder_id FROM folders WHERE user_id = ?';
  return dbAllPromise(query, [userId]);
}

exports.createFolder = (folderId, title, userId, parentFolderId) => {
  const query = 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)';

  return dbAllPromise(query, [folderId, title, userId, parentFolderId]);
};