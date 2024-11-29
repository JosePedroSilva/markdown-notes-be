const express = require('express');
const router = express.Router();
const authenticateTokenMiddleware = require('../middleware/authMiddleware');
const foldersController = require('../controllers/foldersController');

router.use(authenticateTokenMiddleware)

router.post('/', foldersController.createFolder);

router.put('/:folderId', foldersController.updateFolder);

router.delete('/:folderId', foldersController.deleteFolder);

module.exports = router;