const express = require('express');
const morgan = require('morgan');
const itemRouter = require('./routes/itemRoutes');
const userRouter = require('./routes/userRoutes');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./utils/globalErrorHandler');

const app = express();
const cors = require('cors');

app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/items', itemRouter);
app.use('/api/v1/users', userRouter);

app.use('*', (req, res, next) => {
  next(new AppError(`Could not find ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
