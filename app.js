const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const logger = require('./logger');

const app = express();
app.use(cors());
app.use(express.json());

// logger.setLogLevel('DEBUG');

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}`);
});