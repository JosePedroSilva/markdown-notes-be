const sqlite3 = require('sqlite3').verbose();
const folderModel = require('../../src/models/folderModel');

const dbAllPromise = (db, query, params) => {
  return new Promise((resolve, reject) => {
    db.all(query, params, (err, rows) => {
      if (err) return reject(err);
      resolve(rows);
    });
  });
};

jest.mock('../../src/utils/dbAllPromise', () => {
  return (query, params) => dbAllPromise(global.db, query, params);
});

describe('Module Functions Tests', () => {
  let db;

  beforeAll((done) => {
    // Create in-memory database
    db = new sqlite3.Database(':memory:', (err) => {
      if (err) return done(err);
      // Set the global db for dbAllPromise
      global.db = db;
      done();
    });
  });

  afterAll((done) => {
    db.close(done);
  });

  beforeEach((done) => {
    // Set up tables before each test
    db.serialize(() => {
      db.run(
        `CREATE TABLE folders (
          id TEXT PRIMARY KEY, 
          name TEXT, 
          user_id INTEGER, 
          parent_folder_id TEXT, 
          deleted BOOLEAN DEFAULT FALSE, 
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`,
        () => {
          db.run(
            `CREATE TABLE notes (
              id INTEGER PRIMARY KEY, 
              content TEXT, 
              folder_id TEXT, 
              deleted BOOLEAN DEFAULT FALSE, 
              updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            done
          );
        }
      );
    });
  });

  afterEach((done) => {
    // Drop tables after each test
    db.serialize(() => {
      db.run('DROP TABLE IF EXISTS folders', () => {
        db.run('DROP TABLE IF EXISTS notes', done);
      });
    });
  });

  describe('getFoldersByUserId', () => {
    it('should return folders for the given userId', async () => {
      const userId = 1;
      // Insert test data
      await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)', ['1', 'Folder 1', userId, null]);
      await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)', ['2', 'Folder 2', userId, '1']);
      await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id, deleted) VALUES (?, ?, ?, ?, ?)', ['3', 'Deleted Folder', userId, null, true]);

      const result = await folderModel.getFoldersByUserId(userId);

      expect(result).toEqual([
        { id: '1', name: 'Folder 1', parent_folder_id: null },
        { id: '2', name: 'Folder 2', parent_folder_id: '1' },
      ]);
    });

    it('should return empty array if no folders found', async () => {
      const userId = 2; // No folders for this user
      const result = await folderModel.getFoldersByUserId(userId);
      expect(result).toEqual([]);
    });
  });

  describe('createFolder', () => {
    it('should create a new folder', async () => {
      const folderId = 'folder-1';
      const name = 'New Folder';
      const userId = 1;
      const parentFolderId = null;

      await folderModel.createFolder(folderId, name, userId, parentFolderId);

      const rows = await dbAllPromise(db, 'SELECT * FROM folders WHERE id = ?', [folderId]);

      expect(rows.length).toBe(1);
      expect(rows[0]).toMatchObject({
        id: folderId,
        name: name,
        user_id: userId,
        parent_folder_id: null,
        deleted: 0,
      });
    });

    it('should handle errors when creating a folder', async () => {
      const folderId = 'folder-1';
      const name = 'New Folder';
      const userId = 1;
      const parentFolderId = null;

      // Insert a folder with the same id to cause a PRIMARY KEY constraint violation
      await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id) VALUES (?, ?, ?)', [folderId, name, userId]);

      await expect(
        folderModel.createFolder(folderId, name, userId, parentFolderId)
      ).rejects.toThrow();
    });
  });

  describe('updateFolder', () => {
    it('should update an existing folder', async () => {
      const folderId = 'folder-1';
      const name = 'Original Name';
      const userId = 1;
      const parentFolderId = null;

      // Insert initial folder
      await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)', [folderId, name, userId, parentFolderId]);

      // Update folder
      const newName = 'Updated Name';
      const newParentFolderId = 'parent-folder-1';
      await folderModel.updateFolder(folderId, newName, userId, newParentFolderId);

      const rows = await dbAllPromise(db, 'SELECT * FROM folders WHERE id = ?', [folderId]);

      expect(rows.length).toBe(1);
      expect(rows[0]).toMatchObject({
        id: folderId,
        name: newName,
        user_id: userId,
        parent_folder_id: newParentFolderId,
      });
    });

    it('should not update folder if user_id does not match', async () => {
      const folderId = 'folder-1';
      const name = 'Original Name';
      const userId = 1;
      const parentFolderId = null;

      // Insert initial folder
      await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)', [folderId, name, userId, parentFolderId]);

      // Try to update with a different user_id
      const newUserId = 2;
      await folderModel.updateFolder(folderId, 'New Name', newUserId, parentFolderId);

      const rows = await dbAllPromise(db, 'SELECT * FROM folders WHERE id = ?', [folderId]);

      // Should not be updated
      expect(rows[0].name).toBe(name);
    });
  });

  describe('markFolderAndContentsAsDeleted', () => {
    it('should mark folder and its contents as deleted', async () => {
      const userId = 1;
      // Create folders and notes
      await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)', ['1', 'Folder 1', userId, null]);
      await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)', ['2', 'Folder 2', userId, '1']);
      await dbAllPromise(db, 'INSERT INTO notes (id, content, folder_id) VALUES (?, ?, ?)', [1, 'Note 1', '1']);
      await dbAllPromise(db, 'INSERT INTO notes (id, content, folder_id) VALUES (?, ?, ?)', [2, 'Note 2', '2']);

      await folderModel.markFolderAndContentsAsDeleted('1', userId);

      // Check that folders are marked as deleted
      const folders = await dbAllPromise(db, 'SELECT * FROM folders WHERE user_id = ?', [userId]);

      expect(folders.length).toBe(2);
      expect(folders[0].deleted).toBe(1);
      expect(folders[1].deleted).toBe(1);

      // Check that notes are marked as deleted
      const notes = await dbAllPromise(db, 'SELECT * FROM notes');

      expect(notes.length).toBe(2);
      expect(notes[0].deleted).toBe(1);
      expect(notes[1].deleted).toBe(1);
    });

    describe('markFolderAndContentsAsDeleted', () => {
      it('should mark a single folder and its notes as deleted when there is only one folder', async () => {
        const userId = 1;
        // Create a single folder and a note in it
        await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id) VALUES (?, ?, ?)', ['1', 'Single Folder', userId]);
        await dbAllPromise(db, 'INSERT INTO notes (id, content, folder_id) VALUES (?, ?, ?)', [1, 'Note in single folder', '1']);

        await folderModel.markFolderAndContentsAsDeleted('1', userId);

        // Verify that the folder is marked as deleted
        const folders = await dbAllPromise(db, 'SELECT * FROM folders WHERE id = ?', ['1']);
        expect(folders.length).toBe(1);
        expect(folders[0].deleted).toBe(1);

        // Verify that the note is marked as deleted
        const notes = await dbAllPromise(db, 'SELECT * FROM notes WHERE folder_id = ?', ['1']);
        expect(notes.length).toBe(1);
        expect(notes[0].deleted).toBe(1);
      });

      // it('should handle the case when the folder does not exist', async () => {
      //   const userId = 1;
      //   // Attempt to delete a non-existent folder
      //   await expect(folderModel.markFolderAndContentsAsDeleted('non-existent-folder', userId)).resolves.toEqual([{ changes: 0 }, { changes: 0 }]);

      //   // Ensure no folders or notes are marked as deleted
      //   const folders = await dbAllPromise(db, 'SELECT * FROM folders');
      //   expect(folders.length).toBe(0);

      //   const notes = await dbAllPromise(db, 'SELECT * FROM notes');
      //   expect(notes.length).toBe(0);
      // });

      it('should delete nested folders and their notes', async () => {
        const userId = 1;
        // Create a nested folder structure
        await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id) VALUES (?, ?, ?)', ['1', 'Root Folder', userId]);
        await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)', ['2', 'Child Folder', userId, '1']);
        await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)', ['3', 'Grandchild Folder', userId, '2']);

        // Create notes in each folder
        await dbAllPromise(db, 'INSERT INTO notes (content, folder_id) VALUES (?, ?)', ['Note in Root', '1']);
        await dbAllPromise(db, 'INSERT INTO notes (content, folder_id) VALUES (?, ?)', ['Note in Child', '2']);
        await dbAllPromise(db, 'INSERT INTO notes (content, folder_id) VALUES (?, ?)', ['Note in Grandchild', '3']);

        // Delete the root folder
        await folderModel.markFolderAndContentsAsDeleted('1', userId);

        // Verify that all folders are marked as deleted
        const folders = await dbAllPromise(db, 'SELECT * FROM folders WHERE user_id = ?', [userId]);
        expect(folders.length).toBe(3);
        folders.forEach(folder => {
          expect(folder.deleted).toBe(1);
        });

        // Verify that all notes are marked as deleted
        const notes = await dbAllPromise(db, 'SELECT * FROM notes');
        expect(notes.length).toBe(3);
        notes.forEach(note => {
          expect(note.deleted).toBe(1);
        });
      });

      it('should verify that notes inside deleted folders are marked as deleted', async () => {
        const userId = 1;
        // Create folders and notes
        await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id) VALUES (?, ?, ?)', ['1', 'Folder 1', userId]);
        await dbAllPromise(db, 'INSERT INTO notes (id, content, folder_id) VALUES (?, ?, ?)', [1, 'Note 1', '1']);

        // Delete the folder
        await folderModel.markFolderAndContentsAsDeleted('1', userId);

        // Verify the note is marked as deleted
        const notes = await dbAllPromise(db, 'SELECT * FROM notes WHERE folder_id = ?', ['1']);
        expect(notes.length).toBe(1);
        expect(notes[0].deleted).toBe(1);
      });

      it('should only delete notes inside the specified folder and not affect others', async () => {
        const userId = 1;
        // Create multiple folders and notes
        await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id) VALUES (?, ?, ?)', ['1', 'Folder 1', userId]);
        await dbAllPromise(db, 'INSERT INTO folders (id, name, user_id) VALUES (?, ?, ?)', ['2', 'Folder 2', userId]);
        await dbAllPromise(db, 'INSERT INTO notes (id, content, folder_id) VALUES (?, ?, ?)', [1, 'Note in Folder 1', '1']);
        await dbAllPromise(db, 'INSERT INTO notes (id, content, folder_id) VALUES (?, ?, ?)', [2, 'Note in Folder 2', '2']);

        // Delete Folder 1
        await folderModel.markFolderAndContentsAsDeleted('1', userId);

        // Verify Folder 1 is deleted
        const folder1 = await dbAllPromise(db, 'SELECT * FROM folders WHERE id = ?', ['1']);
        expect(folder1[0].deleted).toBe(1);

        // Verify Folder 2 is not deleted
        const folder2 = await dbAllPromise(db, 'SELECT * FROM folders WHERE id = ?', ['2']);
        expect(folder2[0].deleted).toBe(0);

        // Verify Note in Folder 1 is deleted
        const note1 = await dbAllPromise(db, 'SELECT * FROM notes WHERE id = ?', [1]);
        expect(note1[0].deleted).toBe(1);

        // Verify Note in Folder 2 is not deleted
        const note2 = await dbAllPromise(db, 'SELECT * FROM notes WHERE id = ?', [2]);
        expect(note2[0].deleted).toBe(0);
      });
    });
  });
});
