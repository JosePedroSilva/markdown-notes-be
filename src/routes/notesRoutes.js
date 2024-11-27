const express = require('express');
const router = express.Router();
const authenticateTokenMiddleware = require('../middleware/authMiddleware');

const notesController = require('../controllers/notesController');

router.use(authenticateTokenMiddleware);

router.post('/', notesController.createNote);

router.get('/:noteId', notesController.getNote);

router.put('/:noteId', notesController.updateNote);

router.get('/', notesController.getAllNotesOverview);

module.exports = router;
