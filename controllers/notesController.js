const db = require('../config/database');
const logger = require('../logger');
const dbAllPromise = require('../utils/dbAllPromise');
const buildFolderTree = require('../utils/buildFolderTree');

exports.createNote = async (req, res) => {
    const { title, folderId } = req.body;

    if (typeof title !== 'string') {
        logger.error('Invalid input type', { title, folderId });
        return res.status(400).send('Invalid input type');
    }

    if (!req.user) {
        logger.error('User not authenticated');
        return res.status(401).send('User not authenticated');
    }

    const userId = req.user.id;
    logger.trace(`Creating note`, { title, folderId, userId });

    const query = `INSERT INTO notes (id, title, folder_Id, user_Id) VALUES (?, ?, ?, ?)`;

    const noteId = crypto.randomUUID();

    // TODO: Handle the folder id 
    db.run(query, [noteId, title, folderId, userId], (err) => {
        if (err) {
            logger.error(`Failed to create note`, { error: err });
            return res.status(500).send('Failed to create note');
        }

        logger.info(`Note created`, { title, folderId, userId });
        res.status(201).send('Note created');
    });
};

// Returns the base folder and notes tree, note that it does not return the content of the notes
exports.getAllNotesOverview = async (req, res) => {
    if (!req.user) {
        logger.error('User not authenticated');
        return res.status(401).send('User not authenticated');
    }

    const userId = req.user.id;

    logger.trace(`Fetching notes for user`, { userId });


    try {
        const allNotesQuery = `SELECT id, title, folder_id, created_at, updated_at FROM notes WHERE user_id = ?`;

        const foldersQuery = `SELECT id, name, parent_folder_id FROM folders WHERE user_id = ?`;

        logger.trace(`Fetching notes`, { userId });
        const notes = await dbAllPromise(allNotesQuery, [userId]);

        logger.debug(`Fetched notes`, { notes });

        logger.trace(`Fetching folders`, { userId });
        const folders = await dbAllPromise(foldersQuery, [userId]);

        logger.debug(`Fetched folders`, { folders });

        logger.trace(`Building folder tree`, { folders, notes });
        const folderTree = buildFolderTree(folders, notes);

        logger.debug(`Folder tree`, { folderTree });
        res.status(200).send({ folderTree });

    } catch (err) {
        logger.error(`Failed to fetch notes`, { error: err });
        return res.status(500).send('Failed to fetch notes');
    }
}