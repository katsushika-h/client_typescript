import { Request, Response } from "express";

export function responseError(res: Response, statusCode: number, message: string): void {
    responseJSON(res, statusCode, { error: message });
}

export function responseJSON(res: Response, statusCode: number, data: object): void {
    res.header("Content-Type", "application/json; charset=utf-8");
    res.status(statusCode).json(data);
};
