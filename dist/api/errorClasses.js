class NotFoundError extends Error {
    constructor(message) {
        super(message);
    }
}
class BadRequestError extends Error {
    constructor(message) {
        super(message);
    }
}
class UnauthorizedError extends Error {
    constructor(message) {
        super(message);
    }
}
class ForbiddenError extends Error {
    constructor(message) {
        super(message);
    }
}
export { NotFoundError, BadRequestError, UnauthorizedError, ForbiddenError };
