const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const logger = require('./logger');
const authRoutes = require('./routes/authRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    logger.info('Incoming request', { method: req.method, url: req.url });
    next();
});

logger.setLogLevel('TRACE');

app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});