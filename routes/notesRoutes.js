const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authenticateTokenMiddleware = require('../middleware/authMiddleware');
const logger = require('../logger');

router.post('/', authenticateTokenMiddleware, async (req, res) => {
    const { title, folderId } = req.body;

    if (typeof title !== 'string' || typeof folderId !== 'string') {
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

    db.run(query, [noteId, title, folderId, userId], (err) => {
        if (err) {
            logger.error(`Failed to create note`, { error: err });
            return res.status(500).send('Failed to create note');
        }

        logger.info(`Note created`, { title, folderId, userId });
        res.status(201).send('Note created');
    });
});

module.exports = router;