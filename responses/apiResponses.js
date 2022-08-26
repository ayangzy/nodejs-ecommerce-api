const { StatusCodes } = require('http-status-codes');

exports.createdResponse = (res, message, data) => {
    res.status(StatusCodes.CREATED).send({
        statusCode: 201, statusText: 'created', message, data
    });
}

exports.successResponse = (res, message, data) => {
    res.status(StatusCodes.OK).send({
        statusCode: 200, statusText: 'success', message, data
    });
}


exports.notFoundResponse = (res, message, data) => {
    res.status(StatusCodes.OK).send({
        statusCode: 404, statusText: 'not_found', message, data:null
    });
}
