// __tests__/noteModel.test.js
const sqlite3 = require('sqlite3').verbose();
const noteModel = require('../../src/models/noteModel');
const dbAllPromise = require('../../src/utils/dbAllPromise');

jest.mock('../../src/utils/dbAllPromise');

describe('Note Model', () => {
    let db;

    beforeAll((done) => {
        db = new sqlite3.Database(':memory:', (err) => {
            if (err) return done(err);
            db.serialize(() => {
                db.run(`
          CREATE TABLE IF NOT EXISTS notes (
            id TEXT PRIMARY KEY NOT NULL,
            title TEXT NOT NULL,
            content TEXT,
            user_id TEXT NOT NULL,
            folder_id TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id),
            FOREIGN KEY (folder_id) REFERENCES folders(id)
          )
        `, done);
            });
        });
    });

    afterAll((done) => {
        db.close(done);
    });

    test('should create a note', async () => {
        const noteId = '1';
        const title = 'Test Note';
        const folderId = '1';
        const userId = '1';

        dbAllPromise.mockResolvedValueOnce({});

        await expect(noteModel.createNote(noteId, title, folderId, userId)).resolves.toEqual({});

        expect(dbAllPromise).toHaveBeenCalledWith(
            'INSERT INTO notes (id, title, folder_Id, user_Id) VALUES (?, ?, ?, ?)',
            [noteId, title, folderId, userId]
        );
    });

    test('should get all notes by user id', async () => {
        const userId = '1';
        const notes = [
            { id: '1', title: 'Test Note', folder_id: '1', created_at: '2023-01-01', updated_at: '2023-01-01' }
        ];

        dbAllPromise.mockResolvedValueOnce(notes);

        await expect(noteModel.getAllNotesByUserId(userId)).resolves.toEqual(notes);

        expect(dbAllPromise).toHaveBeenCalledWith(
            'SELECT id, title, folder_id, created_at, updated_at FROM notes WHERE user_id = ?',
            [userId]
        );
    });
});