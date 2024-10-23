class ApiResponse {
    constructor(res) {
        this.res = res;
    }

    success(data, message = 'Request was successful') {
        this.res.status(200).json({
            status: 'success',
            message,
            data,
        });
    }

    created(data, message = 'Resource created successfully') {
        this.res.status(201).json({
            status: 'success',
            message,
            data,
        });
    }

    noContent(message = 'No content available') {
        this.res.status(204).json({
            status: 'success',
            message,
        });
    }

    error(err) {
        const statusCode = err.statusCode || 500;
        const message = err.message || 'Internal Server Error';

        this.res.status(statusCode).json({
            status: 'error',
            statusCode,
            message,
        });
    }
}

module.exports = ApiResponse;
