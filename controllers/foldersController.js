const db = require('../config/database');
const logger = require('../logger');

exports.createFolder = async (req, res) => {
    const { title, parentFolderId } = req.body;

    if (typeof title !== 'string') {
        logger.error('Invalid input type', { title, parentFolderId });
        return res.status(400).send('Invalid input type');
    }

    if (!req.user) {
        logger.error('User not authenticated');
        return res.status(401).send('User not authenticated');
    }

    const userId = req.user.id;
    logger.trace(`Creating folder`, { title, parentFolderId, userId });

    const query = `INSERT INTO folders (id, name, user_id, parent_folder_id) VALUES (?, ?, ?, ?)`;

    const folderId = crypto.randomUUID();

    db.run(query, [folderId, title, userId, parentFolderId], (err) => {
        if (err) {
            logger.error(`Failed to create folder`, { error: err });
            return res.status(500).send('Failed to create folder');
        }

        logger.info(`Folder created`, { title, parentFolderId, userId });
        res.status(201).send('Folder created');
    });

}