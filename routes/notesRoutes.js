const express = require('express');
const router = express.Router();
const db = require('../config/database');
const authenticateTokenMiddleware = require('../middleware/authMiddleware');
const logger = require('../logger');
const dbAllPromise = require('../utils/dbAllPromise');
const buildFolderTree = require('../utils/buildFolderTree')

const notesController = require('../controllers/notesController');

router.use(authenticateTokenMiddleware);

router.post('/', notesController.createNote);

router.get('/', notesController.getAllNotesOverview);

module.exports = router;
