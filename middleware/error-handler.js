const { CustomAPIError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const errorHandlerMiddleware = (err, req, res, next) => {
  let costumError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, try again',
  };
  /*if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }*/
  if (err.name === 'ValidationError') {
    costumError.msg = Object.values(err.errors)
      .map(item => item.message)
      .join(', ');
  }

  if (err.code) {
    switch (err.code) {
      case 11000:
        costumError.msg = `Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        costumError.statusCode = 400;
        break;
      default:
        break;
    }
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err });
  return res.status(costumError.statusCode).json({ msg: costumError.msg });
};

module.exports = errorHandlerMiddleware;
