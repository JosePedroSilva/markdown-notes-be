const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const logger = require('./logger');
const requestLogger = require('./middleware/requestLogger');

const authRoutes = require('./routes/authRoutes');
const notesRoutes = require('./routes/notesRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(requestLogger);

const apiRouter = express.Router();

logger.setLogLevel('TRACE');

apiRouter.use('/auth', authRoutes);
apiRouter.use('/notes', notesRoutes);

app.use('/api/v1', apiRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});