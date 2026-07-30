export function responseError(res, statusCode, message) {
    responseJSON(res, statusCode, { error: message });
}
export function responseJSON(res, statusCode, data) {
    res.header("Content-Type", "application/json; charset=utf-8");
    res.status(statusCode).json(data);
}
;
