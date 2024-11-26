// __tests__/database.test.js
const sqlite3 = require('sqlite3').verbose();

describe('Database Initialization', () => {
    let db;

    beforeAll((done) => {
        db = new sqlite3.Database(':memory:', done);
    });

    afterAll((done) => {
        db.close(done);
    });

    test('should create users table', (done) => {
        db.serialize(() => {
            db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
                expect(err).toBeNull();
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='users'", (err, row) => {
                    expect(err).toBeNull();
                    expect(row).not.toBeUndefined();
                    done();
                });
            });
        });
    });

    test('should create folders table', (done) => {
        db.serialize(() => {
            db.run(`
        CREATE TABLE IF NOT EXISTS folders (
          id TEXT PRIMARY KEY NOT NULL,
          name TEXT NOT NULL,
          user_id TEXT NOT NULL,
          parent_folder_id TEXT,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (user_id) REFERENCES users(id),
          FOREIGN KEY (parent_folder_id) REFERENCES folders(id)
        )
      `, (err) => {
                expect(err).toBeNull();
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='folders'", (err, row) => {
                    expect(err).toBeNull();
                    expect(row).not.toBeUndefined();
                    done();
                });
            });
        });
    });

    test('should create notes table', (done) => {
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
      `, (err) => {
                expect(err).toBeNull();
                db.get("SELECT name FROM sqlite_master WHERE type='table' AND name='notes'", (err, row) => {
                    expect(err).toBeNull();
                    expect(row).not.toBeUndefined();
                    done();
                });
            });
        });
    });
});