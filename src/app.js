const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const logger = require('../logger');
const requestLogger = require('./middleware/requestLogger');

const authRoutes = require('./routes/authRoutes');
// const notesRoutes = require('./routes/notesRoutes');
// const foldersRoutes = require('./routes/foldersRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

const apiRouter = express.Router();

logger.setLogLevel('TRACE');

apiRouter.use('/auth', authRoutes);
// apiRouter.use('/notes', notesRoutes);
// apiRouter.use('/folders', foldersRoutes);

app.use('/api/v1', apiRouter);

module.exports = app;